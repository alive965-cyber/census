-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'supervisor', 'enumerator');
CREATE TYPE house_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE survey_status AS ENUM ('draft', 'submitted', 'verified');

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL DEFAULT 'enumerator',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    assigned_ward_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- WARDS TABLE
CREATE TABLE wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    boundary JSONB, -- GeoJSON representation of the ward boundary
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ADD FOREIGN KEY TO USERS NOW THAT WARDS EXISTS
ALTER TABLE users ADD CONSTRAINT fk_user_ward FOREIGN KEY (assigned_ward_id) REFERENCES wards(id) ON DELETE SET NULL;

-- HOUSES TABLE
CREATE TABLE houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_id UUID NOT NULL REFERENCES wards(id) ON DELETE CASCADE,
    house_number VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    location JSONB, -- { "lat": float, "lng": float }
    head_of_family VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    status house_status DEFAULT 'pending',
    enumerator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- UNIQUE CONSTRAINT: ward_id and house_number should be unique
ALTER TABLE houses ADD CONSTRAINT uq_ward_house UNIQUE (ward_id, house_number);

-- SURVEYS TABLE
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    enumerator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    respondent_name VARCHAR(255) NOT NULL,
    family_members_count INTEGER NOT NULL CHECK (family_members_count > 0),
    income_bracket VARCHAR(100),
    facilities JSONB DEFAULT '{}'::jsonb, -- Store dynamic facility info (e.g. { "water": "tap", "electricity": true })
    status survey_status DEFAULT 'draft',
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT uq_house_survey UNIQUE(house_id)
);

-- REPORTS TABLE
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., 'CREATE_SURVEY', 'UPDATE_HOUSE_STATUS'
    entity_type VARCHAR(100) NOT NULL, -- e.g., 'surveys', 'houses'
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_wards_modtime BEFORE UPDATE ON wards FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_houses_modtime BEFORE UPDATE ON houses FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_surveys_modtime BEFORE UPDATE ON surveys FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ROW LEVEL SECURITY (RLS) POLICIES
-- In a real app we would define RLS, but for the basic setup we can leave it simple.
