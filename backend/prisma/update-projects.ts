import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updates = [
    {
      title: 'RoboGPT',
      iconEmoji: '🤖',
      description: `An LLM-powered robotics programming tool that reduced new use-case programming time by <span style="color:#22d3ee;font-weight:500;">50%</span>. Added audio and textual awareness using LangChain and ChatGPT APIs. Integrated zero-shot object detection and YOLO for visual understanding. Plugged into MoveIt + Gazebo simulation pipeline, cutting deployment time from 1 week to just 2 days.<br/><br/>Integrated environment pointcloud as Octomap (via RTAB-Map) in MoveIt for robot-world collision checking during motion planning.`,
      technologies: ['LangChain', 'ChatGPT API', 'YOLO', 'Zero-Shot Detection', 'MoveIt', 'Gazebo', 'ROS2', 'RTAB-Map', 'Octomap'],
    },
    {
      title: 'Vision-based UAV Safe RL',
      iconEmoji: '🚁',
      description: `Vision-based path planning and control of UAVs and Aerial Manipulators using Safe RL. Benchmarked off-policy RL algorithms for path planning using LiDAR — <span style="color:#c084fc;font-weight:500;">accepted at ICUAS 2024</span>. Developing RL trajectory tracking using 3D Point Cloud in complex obstacle environments.`,
      technologies: ['Safe RL', 'LiDAR', '3D Point Cloud', 'ICUAS 2024', 'Python'],
    },
    {
      title: 'Safe RL for Continuum Robots',
      iconEmoji: '🦾',
      description: `Implemented DDPG, TD3, SoftQ, SAC, NAF and constraint-based Safety Layer from scratch using PyTorch. Proposed a constraint-based Safe RL method using SAC + CMA to promote efficient exploration while ensuring robot safety. Built custom Gym environment based on Cosserat-rod/string models.`,
      technologies: ['PyTorch', 'SAC / TD3', 'CMA', 'OpenAI Gym', 'Cosserat Model'],
    },
    {
      title: 'RL for Bionic Legs',
      iconEmoji: '🦿',
      description: `Developed reinforcement learning algorithms for control of musculoskeletal systems with <span style="color:#22d3ee;font-weight:500;">Bionic Legs</span> at the University of Toronto Robotics Institute, Neural Robotics Lab. Bridging RL and biomechanics.`,
      technologies: ['RL', 'Bionic Legs', 'Musculoskeletal', 'PyTorch'],
    },
    {
      title: 'Railhunt — Railway Simulator',
      iconEmoji: '🚂',
      description: `User-friendly simulation tool built with <span style="color:#c084fc;font-weight:500;">MATLAB App-Designer</span> to study hunting stability of railway vehicles. Studied effects of dissimilar rail properties using the DeNOC method for a 17-DOF rail model.`,
      technologies: ['MATLAB', 'App-Designer', 'DeNOC', '17-DOF Model'],
    },
    {
      title: 'ANN Milling Process Model',
      iconEmoji: '🔬',
      description: `Developed an ANN model achieving <span style="color:#60a5fa;font-weight:500;">99.89% accuracy</span> for predicting end milling parameters for Al6061 alloy. Presented at the International Conference of Advanced Manufacturing and Materials Processing (ICAMMP 2021).`,
      technologies: ['ANN', 'Python', 'ICAMMP 2021', '99.89% Accuracy'],
    },
    {
      title: 'Suspension Geometry Optimization',
      iconEmoji: '🏎️',
      description: `Optimized Double Wishbone Suspension Geometry for off-road vehicles using <span style="color:#a78bfa;font-weight:500;">Genetic Algorithm and Machine Learning</span>. Published research on GA-based chassis optimization in MATLAB.`,
      technologies: ['Genetic Algorithm', 'MATLAB', 'SolidWorks', 'Published'],
    },
  ];

  for (const u of updates) {
    const result = await prisma.project.updateMany({
      where: { title: u.title },
      data: {
        description: u.description,
        technologies: u.technologies,
        iconEmoji: u.iconEmoji,
      },
    });
    console.log(`Updated "${u.title}": ${result.count} row(s)`);
  }

  console.log('Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
