import { Router } from 'express';

// Public routers
import { profileRouter }       from './public/profile.routes';
import { experienceRouter }    from './public/experience.routes';
import { projectRouter }       from './public/project.routes';
import { publicationRouter }   from './public/publication.routes';
import { skillRouter }         from './public/skill.routes';
import { educationRouter }     from './public/education.routes';
import { certificationRouter } from './public/certification.routes';
import { awardRouter }         from './public/award.routes';
import { contactRouter }       from './public/contact.routes';
import { healthRouter }        from './public/health.routes';

// Admin routers
import { authRouter }              from './admin/auth.routes';
import { adminExperienceRouter }   from './admin/experience.routes';
import { adminEducationRouter }    from './admin/education.routes';
import { adminProjectRouter }      from './admin/project.routes';
import { adminPublicationRouter }  from './admin/publication.routes';
import { adminSkillRouter }        from './admin/skill.routes';
import { adminCertificationRouter } from './admin/certification.routes';
import { adminAwardRouter }        from './admin/award.routes';
import { adminContactRouter }      from './admin/contact.routes';
import { adminProfileRouter }      from './admin/profile.routes';
import { usersRouter }             from './admin/users.routes';

export const router = Router();

// ---------------------------------------------------------------------------
// Public routes (unauthenticated)
// ---------------------------------------------------------------------------
router.use('/profile',        profileRouter);
router.use('/experience',     experienceRouter);
router.use('/projects',       projectRouter);
router.use('/publications',   publicationRouter);
router.use('/skills',         skillRouter);
router.use('/education',      educationRouter);
router.use('/certifications', certificationRouter);
router.use('/awards',         awardRouter);
router.use('/contact',        contactRouter);
router.use('/health',         healthRouter);

// ---------------------------------------------------------------------------
// Auth routes (login is public; /me and /logout are guarded inside the router)
// ---------------------------------------------------------------------------
router.use('/auth', authRouter);

// ---------------------------------------------------------------------------
// Admin routes (each router applies requireAuth internally)
// ---------------------------------------------------------------------------
router.use('/admin/experience',     adminExperienceRouter);
router.use('/admin/education',      adminEducationRouter);
router.use('/admin/projects',       adminProjectRouter);
router.use('/admin/publications',   adminPublicationRouter);
router.use('/admin/skills',         adminSkillRouter);
router.use('/admin/certifications', adminCertificationRouter);
router.use('/admin/awards',         adminAwardRouter);
router.use('/admin/contact',        adminContactRouter);
router.use('/admin/profile',        adminProfileRouter);
router.use('/admin/users',          usersRouter);
