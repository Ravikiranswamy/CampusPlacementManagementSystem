-- ============================================================================
-- CAMPUS RECRUITMENT AND PLACEMENT MANAGEMENT SYSTEM
-- Course: Database Management Systems (24CS520)
-- JSS Science and Technology University, Mysuru
-- Master Relational Database Schema (All 16 Tables, Views, Triggers & Procedures)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- GROUP A: USER AND STUDENT MANAGEMENT
-- ----------------------------------------------------------------------------

-- Table 1: users (7 attributes)
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('STUDENT', 'PLACEMENT_TEAM', 'PLACEMENT_OFFICER')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: departments (6 attributes)
CREATE TABLE IF NOT EXISTS departments (
    department_id BIGSERIAL PRIMARY KEY,
    department_code VARCHAR(10) NOT NULL UNIQUE,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    hod_name VARCHAR(100),
    office_email VARCHAR(150),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: students (11 attributes)
CREATE TABLE IF NOT EXISTS students (
    student_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    usn VARCHAR(20) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL REFERENCES departments(department_id) ON DELETE RESTRICT,
    section VARCHAR(5),
    cgpa NUMERIC(4, 2) NOT NULL CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    active_backlogs INTEGER NOT NULL DEFAULT 0 CHECK (active_backlogs >= 0),
    graduation_year INTEGER NOT NULL CHECK (graduation_year >= 2000),
    phone VARCHAR(15),
    resume_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: skills (6 attributes)
CREATE TABLE IF NOT EXISTS skills (
    skill_id BIGSERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 5: student_skills (5 attributes - Satisfies DBMS 5-attribute requirement)
CREATE TABLE IF NOT EXISTS student_skills (
    student_id BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) DEFAULT 'INTERMEDIATE',
    certification_url TEXT,
    added_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, skill_id)
);


-- ----------------------------------------------------------------------------
-- GROUP B: COMPANY AND PLACEMENT DRIVE MANAGEMENT
-- ----------------------------------------------------------------------------

-- Table 6: companies (10 attributes)
CREATE TABLE IF NOT EXISTS companies (
    company_id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL UNIQUE,
    industry VARCHAR(100),
    website VARCHAR(255),
    contact_email VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20),
    address TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 7: job_roles (9 attributes)
CREATE TABLE IF NOT EXISTS job_roles (
    job_role_id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE RESTRICT,
    role_title VARCHAR(150) NOT NULL,
    job_type VARCHAR(30) NOT NULL CHECK (job_type IN ('FULL_TIME', 'INTERNSHIP', 'CONTRACT')),
    package_lpa NUMERIC(6, 2) NOT NULL CHECK (package_lpa > 0),
    work_location VARCHAR(150),
    job_description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 8: placement_drives (10 attributes)
CREATE TABLE IF NOT EXISTS placement_drives (
    drive_id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(company_id) ON DELETE RESTRICT,
    job_role_id BIGINT NOT NULL REFERENCES job_roles(job_role_id) ON DELETE RESTRICT,
    drive_title VARCHAR(200) NOT NULL,
    registration_deadline TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    drive_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED')),
    created_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    description TEXT,
    jd1_url VARCHAR(500),
    jd2_url VARCHAR(500),
    jd3_url VARCHAR(500),
    stipend_monthly NUMERIC(8,2),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_deadline_before_drive CHECK (registration_deadline::date <= drive_date)
);

-- Table 9: drive_eligibility (7 attributes)
CREATE TABLE IF NOT EXISTS drive_eligibility (
    eligibility_id BIGSERIAL PRIMARY KEY,
    drive_id BIGINT NOT NULL UNIQUE REFERENCES placement_drives(drive_id) ON DELETE CASCADE,
    min_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 0.00 CHECK (min_cgpa >= 0.0 AND min_cgpa <= 10.0),
    max_active_backlogs INTEGER NOT NULL DEFAULT 0 CHECK (max_active_backlogs >= 0),
    eligible_graduation_year INTEGER NOT NULL CHECK (eligible_graduation_year >= 2000),
    additional_criteria TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 10: drive_eligibility_departments (5 attributes - Satisfies DBMS 5-attribute requirement)
CREATE TABLE IF NOT EXISTS drive_eligibility_departments (
    eligibility_id BIGINT NOT NULL REFERENCES drive_eligibility(eligibility_id) ON DELETE CASCADE,
    department_id BIGINT NOT NULL REFERENCES departments(department_id) ON DELETE RESTRICT,
    min_dept_cgpa NUMERIC(4, 2) DEFAULT NULL CHECK (min_dept_cgpa IS NULL OR (min_dept_cgpa >= 0 AND min_dept_cgpa <= 10)),
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    added_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (eligibility_id, department_id)
);


-- ----------------------------------------------------------------------------
-- GROUP C: APPLICATION AND SELECTION MANAGEMENT
-- ----------------------------------------------------------------------------

-- Table 11: applications (7 attributes)
CREATE TABLE IF NOT EXISTS applications (
    application_id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(student_id) ON DELETE RESTRICT,
    drive_id BIGINT NOT NULL REFERENCES placement_drives(drive_id) ON DELETE RESTRICT,
    applied_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'UNDER_REVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN')),
    eligibility_verified BOOLEAN NOT NULL DEFAULT FALSE,
    remarks TEXT,
    CONSTRAINT uq_student_drive UNIQUE (student_id, drive_id)
);

-- Table 12: selection_rounds (8 attributes)
CREATE TABLE IF NOT EXISTS selection_rounds (
    round_id BIGSERIAL PRIMARY KEY,
    drive_id BIGINT NOT NULL REFERENCES placement_drives(drive_id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL CHECK (round_number >= 1),
    round_name VARCHAR(100) NOT NULL,
    round_description TEXT,
    scheduled_at TIMESTAMP WITHOUT TIME ZONE,
    round_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (round_status IN ('PENDING', 'ONGOING', 'COMPLETED')),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_drive_round UNIQUE (drive_id, round_number)
);

-- Table 13: round_results (7 attributes)
CREATE TABLE IF NOT EXISTS round_results (
    result_id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
    round_id BIGINT NOT NULL REFERENCES selection_rounds(round_id) ON DELETE CASCADE,
    result_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (result_status IN ('QUALIFIED', 'REJECTED', 'PENDING', 'ABSENT')),
    score NUMERIC(6, 2),
    remarks TEXT,
    recorded_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_application_round UNIQUE (application_id, round_id)
);

-- Table 14: offers (9 attributes)
CREATE TABLE IF NOT EXISTS offers (
    offer_id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE REFERENCES applications(application_id) ON DELETE RESTRICT,
    offered_package_lpa NUMERIC(6, 2) NOT NULL CHECK (offered_package_lpa > 0),
    offer_date DATE NOT NULL DEFAULT CURRENT_DATE,
    joining_date DATE,
    offer_status VARCHAR(20) NOT NULL DEFAULT 'OFFERED' CHECK (offer_status IN ('OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')),
    offer_letter_url TEXT,
    additional_info TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_joining_after_offer CHECK (joining_date IS NULL OR joining_date >= offer_date)
);


-- ----------------------------------------------------------------------------
-- GROUP D: ADMINISTRATIVE MANAGEMENT
-- ----------------------------------------------------------------------------

-- Table 15: placement_restrictions (10 attributes)
CREATE TABLE IF NOT EXISTS placement_restrictions (
    restriction_id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(student_id) ON DELETE RESTRICT,
    imposed_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    unblocked_at TIMESTAMP WITHOUT TIME ZONE,
    unblock_reason TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_end_after_start CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Table 16: audit_logs (7 attributes)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    performed_by BIGINT NOT NULL REFERENCES users(user_id) ON DELETE SET NULL,
    action_type VARCHAR(60) NOT NULL,
    entity_name VARCHAR(60) NOT NULL,
    entity_id BIGINT,
    action_detail TEXT,
    performed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ----------------------------------------------------------------------------
-- VIEWS
-- ----------------------------------------------------------------------------

CREATE OR REPLACE VIEW v_student_placement_summary AS
SELECT 
    s.student_id,
    s.usn,
    u.full_name,
    u.email,
    d.department_code,
    d.department_name,
    s.cgpa,
    s.active_backlogs,
    s.graduation_year,
    COUNT(DISTINCT a.application_id) AS total_applications,
    COUNT(DISTINCT CASE WHEN o.offer_status = 'ACCEPTED' THEN o.offer_id END) AS accepted_offers,
    MAX(o.offered_package_lpa) AS highest_package_lpa
FROM students s
JOIN users u ON s.user_id = u.user_id
JOIN departments d ON s.department_id = d.department_id
LEFT JOIN applications a ON s.student_id = a.student_id
LEFT JOIN offers o ON a.application_id = o.application_id
GROUP BY s.student_id, s.usn, u.full_name, u.email, d.department_code, d.department_name, s.cgpa, s.active_backlogs, s.graduation_year;

CREATE OR REPLACE VIEW v_drive_performance_summary AS
SELECT 
    pd.drive_id,
    pd.drive_title,
    c.company_name,
    c.industry,
    jr.role_title,
    jr.job_type,
    jr.package_lpa,
    pd.status AS drive_status,
    pd.drive_date,
    pd.registration_deadline,
    COUNT(DISTINCT a.application_id) AS total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.application_id END) AS selected_students,
    COUNT(DISTINCT o.offer_id) AS total_offers_issued,
    COUNT(DISTINCT CASE WHEN o.offer_status = 'ACCEPTED' THEN o.offer_id END) AS accepted_offers
FROM placement_drives pd
JOIN companies c ON pd.company_id = c.company_id
JOIN job_roles jr ON pd.job_role_id = jr.job_role_id
LEFT JOIN applications a ON pd.drive_id = a.drive_id
LEFT JOIN offers o ON a.application_id = o.application_id
GROUP BY pd.drive_id, pd.drive_title, c.company_name, c.industry, jr.role_title, jr.job_type, jr.package_lpa, pd.status, pd.drive_date, pd.registration_deadline;


-- ----------------------------------------------------------------------------
-- TRIGGERS & TRIGGER FUNCTIONS
-- ----------------------------------------------------------------------------

-- Trigger 1: Disciplinary restriction check trigger on application submission
CREATE OR REPLACE FUNCTION fn_check_student_restriction()
RETURNS TRIGGER AS $$
DECLARE
    v_is_restricted BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM placement_restrictions
        WHERE student_id = NEW.student_id
          AND is_active = TRUE
          AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    ) INTO v_is_restricted;

    IF v_is_restricted THEN
        RAISE EXCEPTION 'Database Constraint Violation: Student ID % has an active placement restriction and cannot apply.', NEW.student_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_blocked_student_apply ON applications;
CREATE TRIGGER trg_prevent_blocked_student_apply
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION fn_check_student_restriction();

-- Trigger 2: Automated audit trail trigger on offer issuance
CREATE OR REPLACE FUNCTION fn_audit_offer_insert()
RETURNS TRIGGER AS $$
DECLARE
    v_officer_id BIGINT;
BEGIN
    SELECT user_id INTO v_officer_id FROM users WHERE role = 'PLACEMENT_OFFICER' LIMIT 1;
    IF v_officer_id IS NULL THEN
        SELECT user_id INTO v_officer_id FROM users LIMIT 1;
    END IF;

    INSERT INTO audit_logs (performed_by, action_type, entity_name, entity_id, action_detail, performed_at)
    VALUES (
        v_officer_id,
        'OFFER_ISSUED_AUTO_AUDIT',
        'OFFER',
        NEW.offer_id,
        CONCAT('Automatic DB Trigger: Offer created with package ', NEW.offered_package_lpa, ' LPA for Application ID ', NEW.application_id),
        CURRENT_TIMESTAMP
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_offer_insert ON offers;
CREATE TRIGGER trg_audit_offer_insert
AFTER INSERT ON offers
FOR EACH ROW
EXECUTE FUNCTION fn_audit_offer_insert();


-- ----------------------------------------------------------------------------
-- STORED PROCEDURES
-- ----------------------------------------------------------------------------

-- Procedure 1: Automatically close expired published drives
CREATE OR REPLACE PROCEDURE sp_close_expired_drives()
LANGUAGE plpgsql
AS $$
DECLARE
    v_closed_count INTEGER;
BEGIN
    UPDATE placement_drives
    SET status = 'CLOSED'
    WHERE status = 'PUBLISHED'
      AND registration_deadline < CURRENT_TIMESTAMP;

    GET DIAGNOSTICS v_closed_count = ROW_COUNT;
    RAISE NOTICE 'Procedure executed: % expired drive(s) have been closed.', v_closed_count;
END;
$$;

-- Procedure 2: Impose bulk disciplinary restriction on an entire department
CREATE OR REPLACE PROCEDURE sp_impose_bulk_restriction(
    p_department_id BIGINT,
    p_officer_id BIGINT,
    p_reason TEXT,
    p_end_date DATE
)
LANGUAGE plpgsql
AS $$
DECLARE
    r_student RECORD;
    v_count INTEGER := 0;
BEGIN
    FOR r_student IN 
        SELECT student_id, usn FROM students
        WHERE department_id = p_department_id
          AND student_id NOT IN (
              SELECT student_id FROM placement_restrictions 
              WHERE is_active = TRUE AND (end_date IS NULL OR end_date >= CURRENT_DATE)
          )
    LOOP
        INSERT INTO placement_restrictions (student_id, imposed_by, reason, start_date, end_date, is_active)
        VALUES (r_student.student_id, p_officer_id, p_reason, CURRENT_DATE, p_end_date, TRUE);

        INSERT INTO audit_logs (performed_by, action_type, entity_name, entity_id, action_detail)
        VALUES (p_officer_id, 'BULK_RESTRICTION', 'STUDENT', r_student.student_id, 
                CONCAT('Bulk restriction imposed on USN: ', r_student.usn, '. Reason: ', p_reason));

        v_count := v_count + 1;
    END LOOP;

    RAISE NOTICE 'Procedure executed: % students restricted.', v_count;
END;
$$;

-- ============================================================================
-- 17. INTERVIEW EXPERIENCES & PAST RECRUITMENT FEEDBACK
-- ============================================================================
CREATE TABLE IF NOT EXISTS interview_feedbacks (
    feedback_id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    company_id BIGINT REFERENCES companies(company_id) ON DELETE SET NULL,
    company_name VARCHAR(150) NOT NULL,
    role_title VARCHAR(150) NOT NULL,
    location VARCHAR(100),
    graduation_year INT NOT NULL,
    interview_mode VARCHAR(20) NOT NULL DEFAULT 'Online' CHECK (interview_mode IN ('Online', 'Offline', 'Hybrid')),
    package_ctc NUMERIC(6,2),
    base_pay NUMERIC(6,2),
    stipend_monthly NUMERIC(8,2),
    coding_rating INT CHECK (coding_rating BETWEEN 1 AND 5),
    interview_rating INT CHECK (interview_rating BETWEEN 1 AND 5),
    overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5),
    technical_round_desc TEXT,
    hr_round_desc TEXT,
    topics_covered TEXT,
    valuable_tips TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_company ON interview_feedbacks(company_id);
CREATE INDEX IF NOT EXISTS idx_feedback_student ON interview_feedbacks(student_id);
CREATE INDEX IF NOT EXISTS idx_feedback_year ON interview_feedbacks(graduation_year);


