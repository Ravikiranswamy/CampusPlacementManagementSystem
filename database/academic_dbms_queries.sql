-- ============================================================================
-- CAMPUS RECRUITMENT AND PLACEMENT MANAGEMENT SYSTEM
-- Course: Database Management Systems (24CS520)
-- JSS Science and Technology University, Mysuru
-- Complete Academic Demonstration SQL Scripts (Phase 1 & Phase 2 Requirements)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SECTION 1: 5 SIMPLE SQL QUERIES
-- ----------------------------------------------------------------------------

-- Q1.1: List all active registered students sorted alphabetically by full name
SELECT s.student_id, s.usn, u.full_name, u.email, s.cgpa, s.graduation_year
FROM students s
JOIN users u ON s.user_id = u.user_id
WHERE u.is_active = TRUE
ORDER BY u.full_name ASC;

-- Q1.2: Retrieve all active recruiting companies in the 'Technology' or 'Software' industry
SELECT company_id, company_name, industry, website, contact_email, contact_phone
FROM companies
WHERE is_active = TRUE AND (industry ILIKE '%Technology%' OR industry ILIKE '%Software%')
ORDER BY company_name;

-- Q1.3: List all currently published placement drives scheduled for future dates
SELECT drive_id, drive_title, drive_date, registration_deadline, status
FROM placement_drives
WHERE status = 'PUBLISHED' AND drive_date >= CURRENT_DATE
ORDER BY registration_deadline ASC;

-- Q1.4: View all job roles offering a compensation package of 10 LPA or higher
SELECT job_role_id, role_title, job_type, package_lpa, work_location
FROM job_roles
WHERE package_lpa >= 10.00 AND is_active = TRUE
ORDER BY package_lpa DESC;

-- Q1.5: Retrieve all accepted placement offers with student and company details
SELECT o.offer_id, s.usn, u.full_name AS student_name, c.company_name, jr.role_title, o.offered_package_lpa, o.joining_date
FROM offers o
JOIN applications a ON o.application_id = a.application_id
JOIN students s ON a.student_id = s.student_id
JOIN users u ON s.user_id = u.user_id
JOIN placement_drives pd ON a.drive_id = pd.drive_id
JOIN companies c ON pd.company_id = c.company_id
JOIN job_roles jr ON pd.job_role_id = jr.job_role_id
WHERE o.offer_status = 'ACCEPTED';


-- ----------------------------------------------------------------------------
-- SECTION 2: 5 NESTED SUBQUERIES
-- ----------------------------------------------------------------------------

-- Q2.1: Find students whose CGPA is strictly greater than the overall college average CGPA
SELECT s.student_id, s.usn, u.full_name, s.cgpa
FROM students s
JOIN users u ON s.user_id = u.user_id
WHERE s.cgpa > (
    SELECT AVG(cgpa) FROM students
);

-- Q2.2: Find placement drives that have received applications from students with 0 backlogs
SELECT drive_id, drive_title, drive_date
FROM placement_drives
WHERE drive_id IN (
    SELECT DISTINCT a.drive_id
    FROM applications a
    JOIN students s ON a.student_id = s.student_id
    WHERE s.active_backlogs = 0
);

-- Q2.3: List companies that offer packages higher than the highest package offered by 'Google' (or any named company)
SELECT DISTINCT c.company_name, jr.role_title, jr.package_lpa
FROM companies c
JOIN job_roles jr ON c.company_id = jr.company_id
WHERE jr.package_lpa > (
    SELECT COALESCE(MAX(jr2.package_lpa), 0)
    FROM job_roles jr2
    JOIN companies c2 ON jr2.company_id = c2.company_id
    WHERE c2.company_name ILIKE '%Demo%'
);

-- Q2.4: Find students who have applied to placement drives but have received NO placement offers
SELECT s.student_id, s.usn, u.full_name
FROM students s
JOIN users u ON s.user_id = u.user_id
WHERE s.student_id IN (SELECT student_id FROM applications)
  AND s.student_id NOT IN (
      SELECT a.student_id 
      FROM applications a 
      JOIN offers o ON a.application_id = o.application_id
  );

-- Q2.5: Find the department with the highest average student CGPA using a nested subquery
SELECT department_id, department_name
FROM departments
WHERE department_id = (
    SELECT department_id
    FROM students
    GROUP BY department_id
    ORDER BY AVG(cgpa) DESC
    LIMIT 1
);


-- ----------------------------------------------------------------------------
-- SECTION 3: SET OPERATIONS (UNION, INTERSECT, EXCEPT)
-- ----------------------------------------------------------------------------

-- Q3.1 (UNION): List all unique user emails across the users table and department office emails
SELECT email AS contact_email, 'USER' AS contact_type FROM users
UNION
SELECT office_email AS contact_email, 'DEPARTMENT_OFFICE' AS contact_type FROM departments WHERE office_email IS NOT NULL;

-- Q3.2 (INTERSECT): Find student IDs who have both the 'Java' skill AND the 'SQL' skill
SELECT ss.student_id
FROM student_skills ss
JOIN skills sk ON ss.skill_id = sk.skill_id
WHERE sk.skill_name = 'Java'
INTERSECT
SELECT ss.student_id
FROM student_skills ss
JOIN skills sk ON ss.skill_id = sk.skill_id
WHERE sk.skill_name = 'SQL';

-- Q3.3 (EXCEPT): Find students who have applied for placement drives but are NOT eligible for Drive ID 1
SELECT student_id FROM applications
EXCEPT
SELECT s.student_id
FROM students s
JOIN drive_eligibility de ON de.drive_id = 1
WHERE s.cgpa >= de.min_cgpa AND s.active_backlogs <= de.max_active_backlogs;


-- ----------------------------------------------------------------------------
-- SECTION 4: GROUP BY & HAVING QUERIES
-- ----------------------------------------------------------------------------

-- Q4.1 (GROUP BY): Count of registered students and average CGPA per department
SELECT d.department_code, d.department_name, 
       COUNT(s.student_id) AS total_students,
       ROUND(AVG(s.cgpa), 2) AS average_cgpa,
       MIN(s.cgpa) AS lowest_cgpa,
       MAX(s.cgpa) AS highest_cgpa
FROM departments d
LEFT JOIN students s ON d.department_id = s.department_id
GROUP BY d.department_id, d.department_code, d.department_name;

-- Q4.2 (GROUP BY): Total applications and selections received per company
SELECT c.company_name,
       COUNT(a.application_id) AS total_applications_received,
       COUNT(CASE WHEN a.status = 'SELECTED' THEN 1 END) AS selected_students
FROM companies c
JOIN placement_drives pd ON c.company_id = pd.company_id
LEFT JOIN applications a ON pd.drive_id = a.drive_id
GROUP BY c.company_id, c.company_name;

-- Q4.3 (HAVING): Departments having an average CGPA strictly greater than 8.00
SELECT d.department_name, ROUND(AVG(s.cgpa), 2) AS avg_cgpa, COUNT(s.student_id) AS student_count
FROM departments d
JOIN students s ON d.department_id = s.department_id
GROUP BY d.department_id, d.department_name
HAVING AVG(s.cgpa) > 8.00;

-- Q4.4 (HAVING): Companies that have published 2 or more placement drives
SELECT c.company_name, COUNT(pd.drive_id) AS drives_conducted
FROM companies c
JOIN placement_drives pd ON c.company_id = pd.company_id
GROUP BY c.company_id, c.company_name
HAVING COUNT(pd.drive_id) >= 2;


-- ----------------------------------------------------------------------------
-- SECTION 5: LIKE & BETWEEN PATTERN MATCHING QUERIES
-- ----------------------------------------------------------------------------

-- Q5.1 (LIKE): Search for students whose USN matches Computer Science format (e.g. '%CS%')
SELECT s.usn, u.full_name, u.email
FROM students s
JOIN users u ON s.user_id = u.user_id
WHERE s.usn LIKE '%CS%';

-- Q5.2 (BETWEEN): Find students whose CGPA falls between 7.50 and 9.00
SELECT s.usn, u.full_name, s.cgpa
FROM students s
JOIN users u ON s.user_id = u.user_id
WHERE s.cgpa BETWEEN 7.50 AND 9.00
ORDER BY s.cgpa DESC;

-- Q5.3 (BETWEEN Dates): Find placement drives scheduled between the current date and next 6 months
SELECT drive_id, drive_title, drive_date, registration_deadline, status
FROM placement_drives
WHERE drive_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '180 days');


-- ----------------------------------------------------------------------------
-- SECTION 6: CORRELATED SUBQUERY
-- ----------------------------------------------------------------------------

-- Q6.1: Find students who have the HIGHEST CGPA in their respective department
SELECT s1.student_id, s1.usn, u.full_name, s1.department_id, d.department_code, s1.cgpa
FROM students s1
JOIN users u ON s1.user_id = u.user_id
JOIN departments d ON s1.department_id = d.department_id
WHERE s1.cgpa = (
    SELECT MAX(s2.cgpa)
    FROM students s2
    WHERE s2.department_id = s1.department_id
);


-- ----------------------------------------------------------------------------
-- SECTION 7: EXISTS & NOT EXISTS QUERIES
-- ----------------------------------------------------------------------------

-- Q7.1 (EXISTS): List companies that have at least one active job role with package >= 8 LPA
SELECT c.company_id, c.company_name, c.industry
FROM companies c
WHERE EXISTS (
    SELECT 1 FROM job_roles jr
    WHERE jr.company_id = c.company_id
      AND jr.package_lpa >= 8.00
      AND jr.is_active = TRUE
);

-- Q7.2 (NOT EXISTS): List students who have NEVER been blocked or disciplined by the placement officer
SELECT s.student_id, s.usn, u.full_name
FROM students s
JOIN users u ON s.user_id = u.user_id
WHERE NOT EXISTS (
    SELECT 1 FROM placement_restrictions pr
    WHERE pr.student_id = s.student_id
);


-- ----------------------------------------------------------------------------
-- SECTION 8: AGGREGATE FUNCTIONS (COUNT, AVG, MAX, MIN, SUM)
-- ----------------------------------------------------------------------------

-- Q8.1: Overall campus recruitment compensation metrics
SELECT 
    COUNT(offer_id) AS total_offers_issued,
    COUNT(CASE WHEN offer_status = 'ACCEPTED' THEN 1 END) AS total_accepted_offers,
    ROUND(AVG(offered_package_lpa), 2) AS average_package_lpa,
    MAX(offered_package_lpa) AS highest_package_lpa,
    MIN(offered_package_lpa) AS minimum_package_lpa,
    ROUND(SUM(offered_package_lpa), 2) AS total_cumulative_compensation_offered_lpa
FROM offers;


-- ----------------------------------------------------------------------------
-- SECTION 9: DATABASE VIEWS
-- ----------------------------------------------------------------------------

-- View 1: Student Placement Summary
SELECT * FROM v_student_placement_summary;

-- View 2: Placement Drive Performance Summary
SELECT * FROM v_drive_performance_summary;


-- ----------------------------------------------------------------------------
-- SECTION 10: REPORTS (REQUIRED BY COURSE RUBRIC)
-- ----------------------------------------------------------------------------

-- REPORT 1: Company-wise and Department-wise Placement Statistics
SELECT 
    c.company_name,
    d.department_code,
    d.department_name,
    COUNT(DISTINCT a.application_id) AS total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN a.application_id END) AS selected_students,
    COUNT(DISTINCT o.offer_id) AS total_offers_issued,
    COUNT(DISTINCT CASE WHEN o.offer_status = 'ACCEPTED' THEN o.offer_id END) AS accepted_offers
FROM companies c
JOIN placement_drives pd ON c.company_id = pd.company_id
JOIN applications a ON pd.drive_id = a.drive_id
JOIN students s ON a.student_id = s.student_id
JOIN departments d ON s.department_id = d.department_id
LEFT JOIN offers o ON a.application_id = o.application_id
GROUP BY c.company_name, d.department_code, d.department_name
ORDER BY c.company_name, d.department_code;

-- REPORT 2: Average and Highest Package Analysis (Company & Overall)
SELECT 
    c.company_name,
    COUNT(o.offer_id) AS accepted_placements,
    ROUND(AVG(o.offered_package_lpa), 2) AS average_package_lpa,
    MAX(o.offered_package_lpa) AS highest_package_lpa,
    MIN(o.offered_package_lpa) AS lowest_package_lpa
FROM offers o
JOIN applications a ON o.application_id = a.application_id
JOIN placement_drives pd ON a.drive_id = pd.drive_id
JOIN companies c ON pd.company_id = c.company_id
WHERE o.offer_status = 'ACCEPTED'
GROUP BY c.company_name
ORDER BY average_package_lpa DESC;

