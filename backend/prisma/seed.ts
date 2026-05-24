import { PrismaClient, ExperienceType, SkillLevel, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // ── Idempotency guard ────────────────────────────────────────────────────────
  const existing = await prisma.profile.findUnique({ where: { id: 1 } });
  if (existing) {
    console.log('Database already seeded, skipping.');
    return;
  }

  console.log('Seeding database…');

  // ── Profile ──────────────────────────────────────────────────────────────────
  await prisma.profile.create({
    data: {
      id: 1,
      name: 'Shaswat Garg',
      email: 'sis_shaswat@outlook.com',
      location: 'Toronto, Ontario, Canada',
      availability: 'Open to Roles',
      bio: [
        'As a kid, I loved taking apart gadgets — not always putting them back together. That curiosity led me to Mechanical Engineering at Delhi Technological University, where I graduated with a Meritorious Award. Along the way, I captained the DTU Baja team, where CAD and simulation met the reality of building actual vehicles.',
        'The idea of creating a robot with human-like movement captivated me. I dove into reinforcement learning, safe control, and manipulation — publishing research on inverse kinematics for continuum robots and vision-based path planning for UAVs.',
        'I served as a research assistant at institutions like IIT Delhi, Toronto Metropolitan University (MITACS), and the University of Toronto\'s Neural Robotics Lab — working on problems ranging from bionic legs to safe RL for aerial manipulators.',
        'After graduating, I joined Orangewood Labs where I built RoboGPT — an LLM-powered system that reduced robot programming time by 50%. That experience showed me how language models could fundamentally change how we interact with physical systems.',
        'Now at ArenaX Labs as an ML Researcher and Engineer, I\'m building the next generation of AI for autonomous systems. My work spans the full stack — from algorithm design and simulation to real-world deployment.',
      ],
      yearsExp: '5+',
      publications: 5,
      projects: '8+',
      awards: 40,
      linkedinUrl: 'https://www.linkedin.com/in/shaswat-garg',
      githubUrl: 'https://shaswat2001.github.io',
    },
  });

  // ── Experience ───────────────────────────────────────────────────────────────
  await prisma.experience.createMany({
    skipDuplicates: true,
    data: [
      // Industry
      {
        title: 'ML Researcher & Engineer',
        organization: 'ArenaX Labs',
        type: ExperienceType.INDUSTRY,
        startDate: 'Apr 2025',
        endDate: null,
        isCurrent: true,
        description: [
          'Toronto, Ontario — Cutting-edge ML research and engineering for autonomous systems and AI-powered robotics.',
        ],
        technologies: ['ML Engineering', 'Deep Learning', 'Autonomous Systems', 'Python', 'PyTorch'],
        sortOrder: 1,
      },
      {
        title: 'Robotics Engineer',
        organization: 'Real Life Robotics',
        type: ExperienceType.INDUSTRY,
        startDate: 'Oct 2024',
        endDate: 'Apr 2025',
        isCurrent: false,
        description: [
          'Waterloo, Ontario — Robotics engineering for real-world autonomous systems deployment.',
        ],
        technologies: ['ROS2', 'Autonomous Systems', 'Robotics', 'Python', 'C++'],
        sortOrder: 2,
      },
      {
        title: 'Robotics Engineer',
        organization: 'Orangewood Labs',
        type: ExperienceType.INDUSTRY,
        startDate: 'Jun 2023',
        endDate: 'Oct 2023',
        isCurrent: false,
        description: [
          'Built RoboGPT — LLM tool reducing new use-case programming time by 50% via LangChain & ChatGPT API',
          'Added zero-shot object detection + YOLO to RoboGPT pipeline for real-time grasping',
          'Integrated MoveIt + Gazebo simulations, cutting deployment from 1 week to 2 days',
          'Integrated environment point cloud as Octomap in MoveIt for robot-world collision checking',
        ],
        technologies: ['LangChain', 'YOLO', 'MoveIt', 'Gazebo', 'ROS2', 'RTAB-Map', 'Python', 'ChatGPT API'],
        sortOrder: 3,
      },
      {
        title: 'Vice Captain & Head of Chassis',
        organization: 'DelTech Baja, DTU',
        type: ExperienceType.INDUSTRY,
        startDate: 'Feb 2020',
        endDate: 'May 2023',
        isCurrent: false,
        description: [
          'CAD modelling and assembly of SAE Baja vehicle in SolidWorks',
          'Structural analysis (implicit/explicit) of components on ANSYS',
          'Researched AI/ML implementation in design and analysis process',
        ],
        technologies: ['SolidWorks', 'ANSYS', 'CAD/FEA', 'MATLAB'],
        sortOrder: 4,
      },
      {
        title: 'Mechanical Intern',
        organization: 'HyperX Energy',
        type: ExperienceType.INDUSTRY,
        startDate: 'Jan 2021',
        endDate: 'Jul 2021',
        isCurrent: false,
        description: [
          'Designed chassis for Prototype II in SolidWorks',
          'Developed vehicle dynamics model in MATLAB',
          'Optimized chassis design using Genetic Algorithms',
        ],
        technologies: ['SolidWorks', 'MATLAB', 'Genetic Algorithms'],
        sortOrder: 5,
      },
      // Research
      {
        title: 'Graduate Research Assistant',
        organization: 'University of Waterloo',
        type: ExperienceType.RESEARCH,
        startDate: 'Jan 2024',
        endDate: 'Apr 2025',
        isCurrent: false,
        description: [
          'MASc Thesis: Vision-based Path Planning & Control of UAVs and Aerial Manipulators using Safe RL',
          'Benchmarked off-policy RL algorithms for UAV path planning with LiDAR — accepted at ICUAS 2024',
          'Developing RL-based trajectory tracking for UAVs in complex obstacle environments using 3D Point Cloud',
          'Research on controlling aerial manipulators using RL in complex and dynamic environments',
        ],
        technologies: ['Safe RL', 'LiDAR', 'UAV', 'Point Cloud', 'PyTorch', 'Python', 'ROS2'],
        sortOrder: 1,
      },
      {
        title: 'Graduate Teaching Assistant',
        organization: 'University of Waterloo',
        type: ExperienceType.RESEARCH,
        startDate: 'Sep 2024',
        endDate: 'Dec 2024',
        isCurrent: false,
        description: [
          'TA for graduate robotics course. Conducted lab sessions, graded assignments, and mentored students.',
        ],
        technologies: ['ROS2', 'Python', 'Robotics'],
        sortOrder: 2,
      },
      {
        title: 'Reinforcement Learning Researcher',
        organization: 'University of Toronto — Neural Robotics Lab',
        type: ExperienceType.RESEARCH,
        startDate: 'Jul 2024',
        endDate: 'Oct 2024',
        isCurrent: false,
        description: [
          'Research on RL-based control of bionic leg prosthetics',
          'Developed simulation environments in OpenAI Gym for gait optimization',
          'Collaborated with interdisciplinary team of engineers and clinicians',
        ],
        technologies: ['Reinforcement Learning', 'OpenAI Gym', 'PyTorch', 'Python', 'Biomechanics'],
        sortOrder: 3,
      },
      {
        title: 'MITACS Research Intern',
        organization: 'Toronto Metropolitan University',
        type: ExperienceType.RESEARCH,
        startDate: 'May 2022',
        endDate: 'Aug 2022',
        isCurrent: false,
        description: [
          'Developed Safe RL algorithms (DDPG, TD3, SAC, NAF) for continuum robot control',
          'Designed custom reward functions for safe manipulation in constrained environments',
          'Published research on inverse kinematics using intelligent neural networks',
        ],
        technologies: ['DDPG', 'TD3', 'SAC', 'NAF', 'PyTorch', 'OpenAI Gym', 'Python'],
        sortOrder: 4,
      },
      {
        title: 'Research Intern',
        organization: 'IIT Delhi',
        type: ExperienceType.RESEARCH,
        startDate: 'Aug 2021',
        endDate: 'May 2022',
        isCurrent: false,
        description: [
          'Developed a 17-DOF railway track simulation (Railhunt) in MATLAB App Designer',
          'Modelled vehicle dynamics with full suspension and bogie geometry',
        ],
        technologies: ['MATLAB', 'App Designer', 'Vehicle Dynamics', 'Simulation'],
        sortOrder: 5,
      },
      {
        title: 'Undergraduate Researcher',
        organization: 'Delhi Technological University',
        type: ExperienceType.RESEARCH,
        startDate: 'Mar 2021',
        endDate: 'Jul 2021',
        isCurrent: false,
        description: [
          'ANN-based real-time modelling of Al6061 milling process — achieved 99.89% accuracy',
          'Published at ICAMMP 2021 International Conference',
        ],
        technologies: ['ANN', 'MATLAB', 'Python', 'Manufacturing', 'ML'],
        sortOrder: 6,
      },
    ],
  });

  // ── Education ────────────────────────────────────────────────────────────────
  await prisma.education.createMany({
    skipDuplicates: true,
    data: [
      {
        institution: 'University of Waterloo',
        degree: 'Master of Applied Science (MASc)',
        field: 'Mechatronics, Robotics & Automation Engineering',
        startYear: 2024,
        endYear: 2025,
        description:
          'Thesis: Vision-based Path Planning and Control of UAVs and Aerial Manipulators using Safe Reinforcement Learning',
        sortOrder: 1,
      },
      {
        institution: 'Delhi Technological University',
        degree: 'Bachelor of Technology (BTech)',
        field: 'Mechanical Engineering',
        startYear: 2019,
        endYear: 2023,
        description: 'Graduated with Meritorious Award for Academic Excellence',
        sortOrder: 2,
      },
      {
        institution: 'DAV Public School',
        degree: 'Secondary Education',
        field: 'Sreshtha Vihar, Delhi',
        startYear: 2007,
        endYear: 2019,
        description: null,
        sortOrder: 3,
      },
    ],
  });

  // ── Projects ─────────────────────────────────────────────────────────────────
  await prisma.project.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'RoboGPT',
        organization: 'Orangewood Labs',
        year: '2023',
        featured: true,
        description:
          'LLM-powered robot programming system using LangChain and ChatGPT API. Reduced time to program new use cases by 50%, integrated zero-shot object detection and YOLO for real-time grasping, with MoveIt + Gazebo for simulation.',
        technologies: ['LangChain', 'ChatGPT API', 'YOLO', 'MoveIt', 'ROS2', 'Gazebo', 'RTAB-Map', 'Python'],
        sortOrder: 1,
      },
      {
        title: 'Vision-based UAV Safe RL',
        organization: 'University of Waterloo',
        year: '2024–25',
        featured: false,
        description:
          'MASc thesis research on vision-based path planning and control of UAVs using Safe Reinforcement Learning. Benchmarked off-policy RL algorithms with LiDAR and 3D Point Cloud for obstacle avoidance. Paper accepted at ICUAS 2024.',
        technologies: ['Safe RL', 'LiDAR', 'Point Cloud', 'PyTorch', 'ROS2', 'UAV', 'Python'],
        paperUrl: 'https://ieeexplore.ieee.org/document/10557148',
        sortOrder: 2,
      },
      {
        title: 'Safe RL for Continuum Robots',
        organization: 'TMU MITACS',
        year: '2022',
        featured: false,
        description:
          'Developed and benchmarked Safe Reinforcement Learning algorithms (DDPG, TD3, SoftQ, SAC, NAF, CMA) for control of tendon-driven continuum robots. Designed custom reward functions for safe manipulation.',
        technologies: ['DDPG', 'TD3', 'SAC', 'NAF', 'CMA', 'OpenAI Gym', 'PyTorch', 'Python'],
        sortOrder: 3,
      },
      {
        title: 'RL for Bionic Legs',
        organization: 'University of Toronto',
        year: '2024',
        featured: false,
        description:
          'Reinforcement learning-based control of bionic leg prosthetics. Developed simulation environments in OpenAI Gym for gait optimization with biomechanical constraints.',
        technologies: ['Reinforcement Learning', 'OpenAI Gym', 'PyTorch', 'Python', 'Biomechanics'],
        sortOrder: 4,
      },
      {
        title: 'Railhunt — Railway Simulator',
        organization: 'IIT Delhi',
        year: '2021–22',
        featured: false,
        description:
          '17-DOF railway track simulation developed in MATLAB App Designer. Models full vehicle dynamics with suspension geometry, bogie kinematics, and track interaction.',
        technologies: ['MATLAB', 'App Designer', 'Vehicle Dynamics', 'Simulation', 'GUI'],
        sortOrder: 5,
      },
      {
        title: 'ANN Milling Process Model',
        organization: 'Delhi Technological University',
        year: '2021',
        featured: false,
        description:
          'Artificial Neural Network model for real-time prediction of Al6061 milling process parameters. Achieved 99.89% accuracy. Published at ICAMMP 2021 International Conference.',
        technologies: ['ANN', 'Python', 'MATLAB', 'Manufacturing', 'Machine Learning'],
        sortOrder: 6,
      },
      {
        title: 'Suspension Geometry Optimization',
        organization: 'HyperX Energy',
        year: '2021',
        featured: false,
        description:
          'Genetic Algorithm and ML-based optimization of vehicle suspension geometry. Automated iterative design process for performance and reliability.',
        technologies: ['Genetic Algorithms', 'MATLAB', 'SolidWorks', 'Optimization', 'ML'],
        sortOrder: 7,
      },
    ],
  });

  // ── Publications ─────────────────────────────────────────────────────────────
  await prisma.publication.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Inverse Kinematics of Tendon Driven Continuum Robots using Intelligent Neural Networks',
        venue: 'INN Journal',
        year: 2022,
        description:
          'Novel approach to solving inverse kinematics problems for continuum robots using intelligent neural networks, enabling precise control of highly flexible robotic systems.',
        sortOrder: 1,
      },
      {
        title: 'Vision-based Path Planning of UAVs using Safe Reinforcement Learning',
        venue: 'ICUAS 2024',
        year: 2024,
        description:
          'Benchmarking of off-policy Safe RL algorithms for autonomous UAV navigation using LiDAR-based obstacle detection. Presented at the International Conference on Unmanned Aircraft Systems 2024.',
        url: 'https://ieeexplore.ieee.org/document/10557148',
        sortOrder: 2,
      },
      {
        title: 'ANN-based Real-Time Modelling of Al6061 Milling',
        venue: 'ICAMMP 2021',
        year: 2021,
        description:
          'Artificial Neural Network model achieving 99.89% accuracy in predicting milling process outcomes for Al6061 aluminum alloy. Published at International Conference on Advanced Manufacturing and Materials Processing.',
        sortOrder: 3,
      },
      {
        title: 'Optimization of Suspension Geometry using Genetic Algorithms and ML',
        venue: 'Technical Report',
        year: 2021,
        description:
          'Combined genetic algorithm and machine learning approach to optimize suspension geometry parameters for improved vehicle dynamics performance.',
        sortOrder: 4,
      },
      {
        title: 'Transforming Manufacturing with Artificial Intelligence — Industry 4.0',
        venue: 'Book Chapter',
        year: 2022,
        description:
          'Comprehensive analysis of AI and ML applications in modern manufacturing processes, exploring the transformation of Industry 4.0 through intelligent automation.',
        sortOrder: 5,
      },
    ],
  });

  // ── Skills ───────────────────────────────────────────────────────────────────
  await prisma.skill.createMany({
    skipDuplicates: true,
    data: [
      // Languages
      { name: 'Python', category: 'Languages', proficiency: 95, level: SkillLevel.Expert, sortOrder: 1 },
      { name: 'MATLAB', category: 'Languages', proficiency: 88, level: SkillLevel.Advanced, sortOrder: 2 },
      { name: 'C++', category: 'Languages', proficiency: 80, level: SkillLevel.Advanced, sortOrder: 3 },
      { name: 'R', category: 'Languages', proficiency: 60, level: SkillLevel.Intermediate, sortOrder: 4 },
      // ML / AI
      { name: 'Reinforcement Learning', category: 'ML / AI', proficiency: 95, level: SkillLevel.Expert, sortOrder: 1 },
      { name: 'PyTorch', category: 'ML / AI', proficiency: 92, level: SkillLevel.Expert, sortOrder: 2 },
      { name: 'Deep Learning', category: 'ML / AI', proficiency: 88, level: SkillLevel.Advanced, sortOrder: 3 },
      { name: 'LLMs / LangChain', category: 'ML / AI', proficiency: 82, level: SkillLevel.Advanced, sortOrder: 4 },
      // Robotics
      { name: 'ROS2', category: 'Robotics', proficiency: 92, level: SkillLevel.Expert, sortOrder: 1 },
      { name: 'Path Planning', category: 'Robotics', proficiency: 94, level: SkillLevel.Expert, sortOrder: 2 },
      { name: 'MoveIt / Gazebo', category: 'Robotics', proficiency: 85, level: SkillLevel.Advanced, sortOrder: 3 },
      { name: 'Computer Vision', category: 'Robotics', proficiency: 84, level: SkillLevel.Advanced, sortOrder: 4 },
      // Perception
      { name: 'LiDAR Processing', category: 'Perception', proficiency: 85, level: SkillLevel.Advanced, sortOrder: 1 },
      { name: '3D Point Cloud', category: 'Perception', proficiency: 83, level: SkillLevel.Advanced, sortOrder: 2 },
      { name: 'YOLO / Detection', category: 'Perception', proficiency: 82, level: SkillLevel.Advanced, sortOrder: 3 },
      { name: 'RTAB-Map', category: 'Perception', proficiency: 72, level: SkillLevel.Intermediate, sortOrder: 4 },
      // Mechanical / CAD
      { name: 'SolidWorks', category: 'Mechanical / CAD', proficiency: 82, level: SkillLevel.Advanced, sortOrder: 1 },
      { name: 'ANSYS (FEA)', category: 'Mechanical / CAD', proficiency: 78, level: SkillLevel.Advanced, sortOrder: 2 },
      { name: 'Genetic Algorithms', category: 'Mechanical / CAD', proficiency: 80, level: SkillLevel.Advanced, sortOrder: 3 },
      { name: 'Dynamic Modelling', category: 'Mechanical / CAD', proficiency: 78, level: SkillLevel.Advanced, sortOrder: 4 },
      // Tools & Platforms
      { name: 'OpenAI Gym', category: 'Tools & Platforms', proficiency: 90, level: SkillLevel.Expert, sortOrder: 1 },
      { name: 'Git / Linux', category: 'Tools & Platforms', proficiency: 85, level: SkillLevel.Advanced, sortOrder: 2 },
      { name: 'ChatGPT / OpenAI API', category: 'Tools & Platforms', proficiency: 84, level: SkillLevel.Advanced, sortOrder: 3 },
      { name: 'NumPy / SciPy', category: 'Tools & Platforms', proficiency: 88, level: SkillLevel.Advanced, sortOrder: 4 },
    ],
  });

  // ── Certifications ───────────────────────────────────────────────────────────
  await prisma.certification.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Convolutional Neural Networks', issuer: 'deeplearning.ai', year: 2021, sortOrder: 1 },
      { name: 'Sequence Models', issuer: 'deeplearning.ai', year: 2021, sortOrder: 2 },
      { name: 'Machine Learning A-Z (Python & R)', issuer: 'Udemy', year: 2020, sortOrder: 3 },
      { name: 'CSWA — Additive Manufacturing', issuer: 'SolidWorks', year: 2022, sortOrder: 4 },
      { name: 'CSWA — Mechanical Design', issuer: 'SolidWorks', year: 2022, sortOrder: 5 },
    ],
  });

  // ── Awards ───────────────────────────────────────────────────────────────────
  await prisma.award.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Meritorious Award — Academic Excellence',
        issuer: 'Delhi Technological University',
        year: 2023,
        description: 'Awarded for outstanding academic performance throughout the BTech program',
        badgeText: '🏆',
        badgeColor: '#fbbf24',
        sortOrder: 1,
      },
      {
        title: 'Meritorious Award — Outstanding Achievement',
        issuer: 'Delhi Technological University',
        year: 2023,
        description: 'Recognized for exceptional contributions to research and extracurricular activities',
        badgeText: '🥇',
        badgeColor: '#fbbf24',
        sortOrder: 2,
      },
      {
        title: 'MITACS Globalink Research Award',
        issuer: 'MITACS Canada',
        year: 2022,
        description: 'Competitive research internship award for international graduate research collaboration',
        badgeText: '🎖️',
        badgeColor: '#60a5fa',
        sortOrder: 3,
      },
    ],
  });

  // ── Default Admin User ───────────────────────────────────────────────────────
  // upsert so re-runs are safe even if someone deleted the profile guard row
  const rawPassword = process.env.ADMIN_INITIAL_PASSWORD ?? 'admin123';
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: 'admin@shaswat.dev' },
    update: {},
    create: {
      email: 'admin@shaswat.dev',
      passwordHash,
      displayName: 'Shaswat Admin',
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log('Seeding complete.');
  console.log('  Profile:        1 row');
  console.log('  Experience:     11 rows');
  console.log('  Education:      3 rows');
  console.log('  Projects:       7 rows');
  console.log('  Publications:   5 rows');
  console.log('  Skills:         24 rows');
  console.log('  Certifications: 5 rows');
  console.log('  Awards:         3 rows');
  console.log('  AdminUser:      1 row (upsert)');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
