import { Language, Project, Experience, TechCategory, Certification, BlogPost } from '../../core/domain/entities/types';

import dkFittImg from '../../images/DK-Fitt.webp';
import nutriSportFittImg from '../../images/NutriSportFitt.webp';
import nexovoImg from '../../images/Nexovo.webp';
import prowessBikeImg from '../../images/ProwessBike.webp';

export const getResumeData = (lang: Language) => {
  const isEs = lang === 'es';

  const PERSONAL_INFO = {
    fullName: 'RICHARD ALEXIS VIVANCO CHICAIZA',
    shortName: 'RICHARD VIVANCO',
    title: 'Mobile Specialist & Full Stack Developer',
    degree: isEs 
      ? 'Ingeniería de Software — Universidad de las Fuerzas Armadas ESPE-L (Egresado)' 
      : 'Software Engineering — Universidad de las Fuerzas Armadas ESPE-L (Graduate)',
    location: 'Quito, Ecuador',
    phone: '(+593) 979 314 381',
    email: 'rvivanco199@gmail.com',
    github: 'https://github.com/ravivanco',
    githubUsername: 'ravivanco',
    linkedin: 'https://linkedin.com/in/richard-vivanco',
    linkedinUsername: 'richard-vivanco',
    instagram: 'https://www.instagram.com/richarfd199/',
    instagramUsername: 'richarfd199',
    stats: {
      commits: '1.2K+',
      contributions: '500+',
      linesOfCode: '50K+',
      followers: '100+',
      projects: '12+',
      repos: '25+',
    },
    bio: isEs 
      ? 'Ingeniero de Software egresado de la Universidad de las Fuerzas Armadas ESPE, especializado en desarrollo móvil con experiencia complementaria en desarrollo backend y web full stack. He construido aplicaciones con integración de inteligencia artificial para reconocimiento de imágenes y recomendación de contenido, así como soluciones móviles para movilidad urbana y delivery. Combino formación técnica sólida en arquitectura de software y bases de datos con capacidad de adaptación rápida a nuevas metodologías, herramientas y equipos ágiles, orientando siempre mi trabajo a construir productos funcionales, escalables y centrados en el usuario.'
      : 'Software Engineer graduated from Universidad de las Fuerzas Armadas ESPE, specializing in mobile development with complementary experience in full stack web and backend development. I have built applications integrating artificial intelligence for image recognition and content recommendation, as well as mobile solutions for urban mobility and delivery. I combine solid technical training in software architecture and databases with a rapid adaptability to new methodologies, tools, and agile teams, always orienting my work towards building functional, scalable, and user-centric products.',
    motto: isEs ? 'Construyendo el presente, diseñando el futuro.' : 'Building the present, designing the future.',
  };

  const EXPERIENCES: Experience[] = [
    {
      id: 'exp-1',
      role: isEs ? 'Desarrollador Móvil — Prácticas Preprofesionales' : 'Mobile Developer — Internship',
      company: 'Kaizen Software',
      period: isEs ? 'Oct. 2025' : 'Oct. 2025',
      location: 'Quito, Ecuador',
      type: isEs ? 'Prácticas Preprofesionales' : 'Internship',
      bullets: isEs ? [
        'Desarrollo de una aplicación móvil de delivery utilizando React Native y Expo, cubriendo flujos de pedido, seguimiento en tiempo real y gestión de usuarios.',
        'Implementación y prueba de módulos nativos con Android Studio para garantizar alta compatibilidad, optimización de memoria y rendimiento en dispositivos Android.',
        'Colaboración directa con el equipo técnico bajo metodologías ágiles (Scrum), participando activamente en revisiones de código, sprints y entregas incrementales.'
      ] : [
        'Developed a mobile delivery application using React Native and Expo, covering order flows, real-time tracking, and user management.',
        'Implemented and tested native modules with Android Studio to ensure high compatibility, memory optimization, and performance on Android devices.',
        'Collaborated directly with the technical team under agile methodologies (Scrum), actively participating in code reviews, sprints, and incremental deliveries.'
      ],
      techUsed: ['React Native', 'Expo', 'Android Studio', 'JavaScript', 'Scrum', 'Git']
    },
    {
      id: 'exp-2',
      role: isEs ? 'Desarrollador Móvil — Proyecto de Vinculación' : 'Mobile Developer — Community Project',
      company: 'PROWESS BIKE',
      period: 'Ago. 2023',
      location: 'Quito, Ecuador',
      type: isEs ? 'Proyecto de Vinculación' : 'Community Project',
      bullets: isEs ? [
        'Desarrollo del módulo móvil de la aplicación con Flutter y Android Studio, enfocado en la experiencia de usuario para gestión de rutas y bicicletas.',
        'Participación en el diseño de la interfaz de usuario (UI/UX) y la lógica de negocio de la app, coordinando con el equipo multidisciplinario del proyecto universitario.',
        'Integración con servicios cartográficos de Google Maps API para trazado interactivo de recorridos ciclistas y cálculo de distancias.'
      ] : [
        'Developed the mobile module of the application with Flutter and Android Studio, focused on the user experience for route and bicycle management.',
        'Participated in the user interface (UI/UX) design and business logic of the app, coordinating with the multidisciplinary team of the university project.',
        'Integrated with Google Maps API cartographic services for interactive tracing of cycling routes and distance calculation.'
      ],
      techUsed: ['Flutter', 'Dart', 'Android Studio', 'Google Maps API', 'Mobile UX']
    },
    {
      id: 'exp-3',
      role: isEs ? 'Desarrollador Full Stack' : 'Full Stack Developer',
      company: 'NYC Arquitectos',
      period: 'Ago. 2021',
      location: 'Quito, Ecuador',
      type: isEs ? 'Freelance / Proyecto' : 'Freelance / Project',
      bullets: isEs ? [
        'Diseño y desarrollo integral del sitio web corporativo del estudio de arquitectura, cubriendo tanto el frontend responsivo como la API backend.',
        'Implementación de funcionalidades a medida para presentar portafolios interactivos de proyectos arquitectónicos y un gestor de contenidos dinámico.',
        'Optimización de carga SEO, estructuras visuales elegantes y maquetación adaptada a dispositivos móviles y de escritorio.'
      ] : [
        'Comprehensive design and development of the architecture firm\'s corporate website, covering both the responsive frontend and backend API.',
        'Implementation of custom functionalities to present interactive portfolios of architectural projects and a dynamic content manager.',
        'SEO load optimization, elegant visual structures, and responsive layout adapted for mobile and desktop devices.'
      ],
      techUsed: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'JavaScript', 'MySQL']
    }
  ];

  const PROJECTS: Project[] = [
    {
      id: 'dk-fitt',
      title: 'DK-Fitt',
      subtitle: isEs ? 'Proyecto de Titulación: App móvil de control nutricional con IA' : 'Thesis Project: AI-powered Nutritional Control Mobile App',
      category: 'ai',
      date: 'Feb. 2026',
      description: 'Complete technological solution (Web/Mobile) for nutritional supervision and comprehensive patient tracking in continuous collaboration with nutrition professionals.',
      bullets: [
        'Mobile Module (Patient): Capture of biometric data and daily logging of the patient\'s status.',
        'AI Recognition: Implementation of computer vision/AI for automatic calorie estimation through photographs of food plates.',
        'Intelligent Planning: Dynamic generation of adapted menus with AI and management of alerts and reminders.',
        'Web Module (Nutritionist): Dashboard for clinical tracking, evaluation of biometric metrics, and validation of nutritional plans.'
      ],
      techStack: ['React Native', 'Node.js', 'PostgreSQL', 'IA Vision', 'Cloudinary', 'Expo'],
      imageUrl: dkFittImg,
      githubUrl: 'https://github.com/ravivanco/DK-Fitt',
      hasAiDemo: true
    },
    {
      id: 'nutrisportiff',
      title: 'NutriSportFit',
      subtitle: 'Mobile & Cloud Developer — Health and Nutrition Mobile Application',
      category: 'mobile',
      date: 'Feb. 2025',
      description: 'Health-oriented personalized mobile application based on user biometric data and automated recommendations.',
      bullets: [
        'Biometric Calculation: Algorithm for immediate calculation of Body Mass Index (BMI) from initial variables.',
        'Nutritional Recommendation Engine: Algorithm connected to Cloud architecture that generates daily and weekly meal plans.',
        'Cloud Integration: Efficient storage and processing of data in the cloud to ensure fast and personalized responses.'
      ],
      techStack: ['Flutter', 'Dart', 'Firebase', 'Android Studio'],
      imageUrl: nutriSportFittImg,
      githubUrl: 'https://github.com/ravivanco/NutriSportiff'
    },
    {
      id: 'prowess-bike',
      title: 'PROWESS BIKE',
      subtitle: 'Software Developer — Community Commerce Platform',
      category: 'mobile',
      date: 'Ago. 2023',
      description: 'Social impact and local commerce project aimed at boosting small producers in the Cotopaxi province (Latacunga).',
      bullets: [
        'Digital Micro-market: Creation of a catalog for the direct commercialization of local products.',
        'Logistics and Distribution: Module for order management, delivery traceability, and optimal route calculation.',
        'Alerts and Interaction: Real-time notification system regarding the status of purchases and deliveries.'
      ],
      techStack: ['Flutter', 'Android Studio', 'Google Maps API', 'Dart'],
      imageUrl: prowessBikeImg,
      githubUrl: 'https://github.com/ravivanco/PROWESS-BIKE'
    },
    {
      id: 'kaizen-delivery',
      title: 'NEXOVO (Kaizen Software)',
      subtitle: 'Full Stack & Mobile Developer — Logistics / Delivery Web and Mobile Application',
      category: 'mobile',
      date: 'Oct. 2025',
      description: 'Mobile and web delivery application under a real-time direct service negotiation model (InDrive style).',
      bullets: [
        'Real-Time Communication: Integration of live chat between client and driver within the mobile and web application.',
        'Operational Management: Development of automated date assignment, delivery scheduling, and notification engine.',
        'UI/UX Development: Design and implementation of interactive and adaptive interfaces for mobile and web platforms.'
      ],
      techStack: ['React Native', 'Expo', 'Android Studio', 'Node.js', 'Express'],
      imageUrl: nexovoImg,
      githubUrl: 'https://github.com/ravivanco'
    },
    {
      id: 'nyc-arquitectos',
      title: 'NYC Arquitectos',
      subtitle: 'Full Stack Developer — Corporate Web Platform',
      category: 'fullstack',
      date: 'Ago. 2021',
      description: 'Comprehensive web platform designed for the operational and commercial management of the architecture firm, optimizing communication and project administration.',
      bullets: [
        'Full Stack Development: Complete implementation of the frontend and backend architecture for the platform.',
        'Dynamic Content Management: Administration module for architects to update the catalog of projects and services in real-time.',
        'Appointments and Payments System: Implementation of technical visit scheduling and integrated payment gateway for clients.',
        'Inquiries and Alerts Module: Development of a direct channel for resolving project queries and an automated internal support notification system.'
      ],
      techStack: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'MySQL'],
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      githubUrl: 'https://github.com/ravivanco'
    }
  ];

  const TECH_CATEGORIES: TechCategory[] = [
    {
      title: isEs ? 'Desarrollo Móvil' : 'Mobile Development',
      skills: [
        { name: 'React Native', badge: 'Advanced' },
        { name: 'Flutter' },
        { name: 'Expo' },
        { name: 'Android Studio' }
      ]
    },
    {
      title: 'Backend & Web',
      skills: [
        { name: 'Node.js', badge: 'Advanced' },
        { name: 'Express' },
        { name: 'Laravel' },
        { name: 'Spring Boot' },
        { name: 'Python' }
      ]
    },
    {
      title: 'Frontend / Web',
      skills: [
        { name: 'React', badge: 'Advanced' },
        { name: 'JavaScript' },
        { name: 'HTML5' },
        { name: 'Tailwind CSS' },
        { name: 'Bootstrap' }
      ]
    },
    {
      title: isEs ? 'Lenguajes' : 'Languages',
      skills: [
        { name: 'Java' },
        { name: 'JavaScript / TS', badge: 'Advanced' },
        { name: 'Python' },
        { name: 'C#' },
        { name: 'C++' }
      ]
    },
    {
      title: isEs ? 'Bases de Datos' : 'Databases',
      skills: [
        { name: 'PostgreSQL', badge: 'Advanced' },
        { name: 'MySQL' },
        { name: 'MongoDB' },
        { name: 'phpMyAdmin' }
      ]
    },
    {
      title: isEs ? 'IA & Automatización' : 'AI & Automation',
      skills: [
        { name: 'Image Recognition (Vision AI)' },
        { name: 'Recommendation Engines' },
        { name: 'N8N Automation' },
        { name: 'LLM / Gemini Integration' }
      ]
    }
  ];

  const CERTIFICATIONS: Certification[] = [
    {
      title: isEs ? 'Fundamentos de Ciberseguridad' : 'Cybersecurity Fundamentals',
      issuer: 'Universidad de las Fuerzas Armadas ESPE',
      year: '2025',
      iconName: 'ShieldCheck'
    },
    {
      title: isEs ? 'Ciencia de Datos y Machine Learning aplicado a la Ciberseguridad' : 'Data Science and Machine Learning applied to Cybersecurity',
      issuer: 'Universidad de las Fuerzas Armadas ESPE',
      year: '2025',
      iconName: 'Cpu'
    }
  ];

  const LANGUAGES = [
    { name: isEs ? 'Español' : 'Spanish', level: isEs ? 'Nativo // MAX' : 'Native // MAX' },
    { name: isEs ? 'Inglés' : 'English', level: isEs ? 'Nivel B1 // MID' : 'Level B1 // MID' }
  ];

  const BLOG_POSTS: BlogPost[] = [
    {
      id: 'post-1',
      title: isEs 
        ? 'Integración de Visión por Computadora en Dispositivos Móviles: El Caso DK-Fitt' 
        : 'Integration of Computer Vision in Mobile Devices: The DK-Fitt Case',
      summary: isEs 
        ? 'Cómo conectamos modelos de clasificación e identificación de alimentos por fotografía con una arquitectura móvil React Native y backend Node.js en tiempo real.'
        : 'How we connected food classification and identification models via photography with a real-time React Native mobile architecture and Node.js backend.',
      category: 'AI & ML',
      date: isEs ? '10 Feb 2026' : 'Feb 10, 2026',
      readTime: isEs ? '6 min lectura' : '6 min read',
      tags: ['Computer Vision', 'React Native', 'Node.js', 'AI Nutrition'],
      content: isEs ? `
### Introducción

El proyecto **DK-Fitt** nació de la necesidad de simplificar el seguimiento nutricional para usuarios y nutricionistas. El mayor obstáculo en la medición dietética es el registro manual.

### Arquitectura de Reconocimiento Visual

Implementamos un pipeline de inferencia optimizado:
1. **Captura Móvil**: Compresión de imagen client-side con Expo Camera para minimizar latencia.
2. **Streaming a API Gateway**: Transmisión multipart/form-data hacia nuestro microservicio Node.js.
3. **Pipeline de Inferencia**: Procesamiento mediante modelo de Visión especializado en segmentación gastronómica.
4. **Respuesta Estructurada**: Retorno de alimentos detectados, probabilidad de confianza y estimación de macronutrientes.

\`\`\`typescript
// Fragmento de envío de fotografía en React Native
async function analyzeFoodImage(imageUri: string) {
  const formData = new FormData();
  formData.append('photo', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'meal_scan.jpg',
  } as any);

  const response = await fetch('/api/vision/analyze-meal', {
    method: 'POST',
    body: formData,
  });
  return response.json();
}
\`\`\`

### Conclusiones y Futuro
Esta integración redujo el tiempo de registro alimenticio de 3 minutos a menos de 4 segundos por plato, logrando una precisión promedio del 92% en pruebas de campo.
      ` : `
### Introduction

The **DK-Fitt** project was born from the need to simplify nutritional tracking for users and nutritionists. The biggest obstacle in dietary measurement is manual logging.

### Visual Recognition Architecture

We implemented an optimized inference pipeline:
1. **Mobile Capture**: Client-side image compression with Expo Camera to minimize latency.
2. **Streaming to API Gateway**: Multipart/form-data transmission to our Node.js microservice.
3. **Inference Pipeline**: Processing through a specialized Vision model for gastronomic segmentation.
4. **Structured Response**: Return of detected foods, confidence probability, and macronutrient estimation.

\`\`\`typescript
// React Native photo submission snippet
async function analyzeFoodImage(imageUri: string) {
  const formData = new FormData();
  formData.append('photo', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'meal_scan.jpg',
  } as any);

  const response = await fetch('/api/vision/analyze-meal', {
    method: 'POST',
    body: formData,
  });
  return response.json();
}
\`\`\`

### Conclusions and Future
This integration reduced food logging time from 3 minutes to less than 4 seconds per plate, achieving an average accuracy of 92% in field tests.
      `
    },
    {
      id: 'post-2',
      title: isEs 
        ? 'Módulos Nativos en Android Studio para Apps React Native & Expo' 
        : 'Native Modules in Android Studio for React Native & Expo Apps',
      summary: isEs 
        ? 'Guía práctica basada en mi experiencia en Kaizen Software sobre cuándo y cómo invocar capacidades nativas de Android sin comprometer la agilidad de Expo.' 
        : 'A practical guide based on my experience at Kaizen Software on when and how to invoke native Android capabilities without compromising Expo agility.',
      category: 'Mobile',
      date: isEs ? '15 Nov 2025' : 'Nov 15, 2025',
      readTime: isEs ? '5 min lectura' : '5 min read',
      tags: ['React Native', 'Android Studio', 'Expo', 'Native Modules'],
      content: isEs ? `
### ¿Por qué recurrir a Módulos Nativos?

Aunque Expo ofrece una excelente suite de APIs out-of-the-box, aplicaciones avanzadas de logística y delivery requieren optimización directa de memoria, sensores GPS en background y drivers de hardware específicos.

### Pasos Clave en Android Studio

1. **Configuración del Expo Prebuild**: Generar la carpeta \`android/\` limpia.
2. **Creación del Java/Kotlin Package**: Registrar el módulo exponiendo metodos anotados con \`@ReactMethod\`.
3. **Manejo de Hilos**: Ejecutar procesos pesados en hilos secundarios para no congelar la UI de React Native.

\`\`\`java
@ReactMethod
public void startHighPrecisionGPS(Promise promise) {
    try {
        LocationManager.startService();
        promise.resolve("GPS_NATIVE_ACTIVE");
    } catch (Exception e) {
        promise.reject("ERR_GPS", e.getMessage());
    }
}
\`\`\`
      ` : `
### Why resort to Native Modules?

Although Expo offers an excellent suite of out-of-the-box APIs, advanced logistics and delivery applications require direct memory optimization, background GPS sensors, and specific hardware drivers.

### Key Steps in Android Studio

1. **Expo Prebuild Configuration**: Generate a clean \`android/\` folder.
2. **Java/Kotlin Package Creation**: Register the module exposing methods annotated with \`@ReactMethod\`.
3. **Thread Management**: Execute heavy processes on secondary threads so as not to freeze the React Native UI.

\`\`\`java
@ReactMethod
public void startHighPrecisionGPS(Promise promise) {
    try {
        LocationManager.startService();
        promise.resolve("GPS_NATIVE_ACTIVE");
    } catch (Exception e) {
        promise.reject("ERR_GPS", e.getMessage());
    }
}
\`\`\`
      `
    },
    {
      id: 'post-3',
      title: isEs 
        ? 'Automatización de Workflows con N8N e Integración de Microservicios' 
        : 'Workflow Automation with N8N and Microservices Integration',
      summary: isEs 
        ? 'Exploración de N8N para conectar webhooks de pedidos de delivery, alertas de usuario y servicios en la nube de forma ágil y mantenible.'
        : 'Exploration of N8N to connect delivery order webhooks, user alerts, and cloud services in an agile and maintainable way.',
      category: 'Backend',
      date: isEs ? '02 Sep 2025' : 'Sep 02, 2025',
      readTime: isEs ? '4 min lectura' : '4 min read',
      tags: ['N8N', 'Automation', 'Python', 'Webhooks'],
      content: isEs ? `
### El poder de la Automatización No-Code / Low-Code

Durante la construcción de pipelines de datos y notificaciones, N8N permite desacoplar tareas pesadas como el envío de correos, generación de reportes PDF y webhook callbacks sin saturar el servidor principal Express.

### Casos de Uso Implementados
* **Notificaciones de Pedidos**: Disparo automático hacia Telegram y SMS al cambiar estado de delivery.
* **Transformación de Datos**: Scripts Python embebidos en nodos N8N para limpiar entradas JSON antes de persistir en PostgreSQL.
      ` : `
### The power of No-Code / Low-Code Automation

During the construction of data and notification pipelines, N8N allows decoupling heavy tasks such as sending emails, PDF report generation, and webhook callbacks without saturating the main Express server.

### Implemented Use Cases
* **Order Notifications**: Automatic triggering to Telegram and SMS upon delivery status change.
* **Data Transformation**: Python scripts embedded in N8N nodes to clean JSON inputs before persisting in PostgreSQL.
      `
    },
    {
      id: 'post-4',
      title: isEs 
        ? 'Aplicación de Machine Learning y Ciberseguridad en la Nube'
        : 'Application of Machine Learning and Cybersecurity in the Cloud',
      summary: isEs 
        ? 'Conceptos clave aprendidos en la certificación de la Universidad ESPE sobre detección de anomalías y protección de APIs móviles.'
        : 'Key concepts learned in the ESPE University certification on anomaly detection and mobile API protection.',
      category: 'Cybersecurity',
      date: isEs ? '18 Jul 2025' : 'Jul 18, 2025',
      readTime: isEs ? '7 min lectura' : '7 min read',
      tags: ['Cybersecurity', 'Machine Learning', 'ESPE', 'API Security'],
      content: isEs ? `
### Detección de Amenazas en Puntos de Entrada Móviles

Las APIs REST expuestas a aplicaciones móviles deben resguardarse contra bots, peticiones maliciosas e inyecciones.

### Principales Recomendaciones
* **Certificate Pinning**: Previene ataques Man-In-The-Middle en comunicaciones móviles.
* **Modelos de Clasificación**: Entrenamiento con scikit-learn para identificar patrones anómalos de tráfico API.
* **Encriptación de Token Bearer**: Rotación constante de llaves JWT y validación en middleware Express.
      ` : `
### Threat Detection in Mobile Entry Points

REST APIs exposed to mobile applications must be safeguarded against bots, malicious requests, and injections.

### Main Recommendations
* **Certificate Pinning**: Prevents Man-In-The-Middle attacks in mobile communications.
* **Classification Models**: Training with scikit-learn to identify anomalous patterns in API traffic.
* **Bearer Token Encryption**: Constant rotation of JWT keys and validation in Express middleware.
      `
    }
  ];

  return {
    PERSONAL_INFO,
    EXPERIENCES,
    PROJECTS,
    TECH_CATEGORIES,
    CERTIFICATIONS,
    LANGUAGES,
    BLOG_POSTS
  };
};
