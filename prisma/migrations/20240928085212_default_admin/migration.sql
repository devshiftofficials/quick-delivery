-- CreateDefaultAdmin
INSERT INTO User (email, password, name, role, emailVerified, createdAt, updatedAt)
VALUES (
    'admin@gmail.com',
    '$2a$10$9O7J8kO3O1J2X3rQ4O4O4uXkO4O4O4O4O4O4O4O4O4O4O4O4O4O4.',
    'Admin',
    'ADMIN',
    true,
    NOW(),
    NOW()
);