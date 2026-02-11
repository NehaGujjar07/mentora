const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const coursesData = [
    // --- Web Development ---
    {
        title: "The Web Developer Bootcamp 2026",
        description: "The only course you need to learn web development - HTML, CSS, JS, Node, and more!",
        price: 19.99,
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1472&q=80",
        category: "Web Development",
        level: "Beginner",
        language: "English",
        learningOutcomes: [
            "Build 13+ web development projects for your portfolio",
            "Master HTML5, CSS3, and Modern JavaScript",
            "Learn Node.js, Express, and MongoDB for backend",
            "Create responsive layouts with Flexbox and Grid"
        ],
        requirements: [
            "No programming experience needed",
            "A computer with internet access"
        ],
        lessons: [
            { title: "HTML Basics", content: "Introduction to HTML tags and structure.", videoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU", freePreview: true },
            { title: "CSS Styling", content: "Styling your pages with CSS.", videoUrl: "https://www.youtube.com/embed/1Rs2ND1ryYc" },
            { title: "JS Fundamentals", content: "Variables, loops, and functions.", videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk" }
        ]
    },
    {
        title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
        description: "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!",
        price: 84.99,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        category: "Web Development",
        level: "Intermediate",
        language: "English",
        learningOutcomes: [
            "Build powerful, fast, user-friendly and reactive web apps",
            "Apply for high-paid jobs or work as a freelancer",
            "Learn all about React Hooks and React Components"
        ],
        requirements: [
            "Basic understanding of JavaScript and HTML/CSS"
        ],
        lessons: [
            { title: "What is React?", content: "Understanding the Virtual DOM.", videoUrl: "https://www.youtube.com/embed/N3AkSS5hXMA", freePreview: true },
            { title: "React Components", content: "Building reusable UI components.", videoUrl: "https://www.youtube.com/embed/Y2hgEGPzTZY" }
        ]
    },
    {
        title: "Advanced CSS and Sass: Flexbox, Grid, Animations",
        description: "The most advanced and modern CSS course on the internet: master flexbox, CSS Grid, responsive design, and so much more.",
        price: 12.99,
        thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        category: "Web Development",
        level: "Advanced",
        language: "English",
        learningOutcomes: [
            "Tons of modern CSS techniques to create stunning designs",
            "Advanced CSS animations with @keyframes, transitions and transforms",
            "How to use Sass in real-world projects"
        ],
        requirements: [
            "Basic CSS knowledge"
        ],
        lessons: [
            { title: "CSS Grid Operations", content: "Building complex layouts.", videoUrl: "https://www.youtube.com/embed/7kVeCqQCxlk" }
        ]
    },

    // --- Data Science ---
    {
        title: "Machine Learning A-Z™: Python & R in Data Science",
        description: "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.",
        price: 129.99,
        thumbnail: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80",
        category: "Data Science",
        level: "Beginner",
        language: "English",
        learningOutcomes: [
            "Master Machine Learning on Python & R",
            "Make robust Machine Learning models",
            "Make accurate predictions"
        ],
        requirements: [
            "High school math level"
        ],
        lessons: [
            { title: "Data Preprocessing", content: "Cleaning data sets.", videoUrl: "https://www.youtube.com/embed/GtcT84XQ0ak", freePreview: true },
            { title: "Linear Regression", content: "Predicting continuous values.", videoUrl: "https://www.youtube.com/embed/ksS_yBE6P1Q" }
        ]
    },
    {
        title: "Python for Data Science and Machine Learning Bootcamp",
        description: "Learn how to use NumPy, Pandas, Seaborn , Matplotlib , Plotly , Scikit-Learn , Machine Learning, Tensorflow , and more!",
        price: 94.99,
        thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
        category: "Data Science",
        level: "Beginner",
        language: "English",
        learningOutcomes: [
            "Use Python for Data Science and Machine Learning",
            "Use Spark for Big Data Analysis",
            "Implement Machine Learning Algorithms"
        ],
        requirements: [
            "No prior programming experience required"
        ],
        lessons: [
            { title: "Python Crash Course", content: "Python basics for data science.", videoUrl: "https://www.youtube.com/embed/JJmcL1N2KQs" }
        ]
    },

    // --- Business ---
    {
        title: "An Entire MBA in 1 Course: Award Winning Business School Prof",
        description: "Everything You Need to Know About Business from Start-up to IPO.",
        price: 49.99,
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1415&q=80",
        category: "Business",
        level: "All Levels",
        language: "English",
        learningOutcomes: [
            "Launch a company from scratch",
            "Get many customers by using the best networking tools",
            "Raise capital"
        ],
        requirements: [
            "None"
        ],
        lessons: [
            { title: "Idea Generation", content: "How to come up with billion dollar ideas.", videoUrl: "https://www.youtube.com/embed/9tU-D-m2JY8" }
        ]
    },

    // --- Design ---
    {
        title: "User Experience Design Essentials - Adobe XD UI UX Design",
        description: "Use Adobe XD to design and build a mobile app. Become a UX designer.",
        price: 89.99,
        thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        category: "Design",
        level: "Beginner",
        language: "English",
        learningOutcomes: [
            "Become a UX designer",
            "Build a UX portfolio",
            "Design a mobile app from scratch"
        ],
        requirements: [
            "Adobe XD installed"
        ],
        lessons: [
            { title: "Intro to UX", content: "What is User Experience?", videoUrl: "https://www.youtube.com/embed/gHGN6hs2gZY" }
        ]
    },
    {
        title: "Complete Blender Creator: Learn 3D Modelling for Beginners",
        description: "Use Blender to create beautiful 3D models for video games, 3D printing, house design etc.",
        price: 34.99,
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1574&q=80",
        category: "Design",
        level: "Beginner",
        language: "English",
        learningOutcomes: [
            "Use Blender and understand its interface",
            "Create 3D models with UV mapping and textures",
            "Render your models"
        ],
        requirements: [
            "Blender installed (free)"
        ],
        lessons: [
            { title: "Blender Interface", content: "Navigating the 3D viewport.", videoUrl: "https://www.youtube.com/embed/nIoXOplUvAw" }
        ]
    },

    // --- Marketing ---
    {
        title: "The Complete Digital Marketing Course - 12 Courses in 1",
        description: "Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!",
        price: 149.99,
        thumbnail: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        category: "Marketing",
        level: "Beginner",
        language: "English",
        learningOutcomes: [
            "Grow a business online from scratch",
            "Make money as an affiliate marketer",
            "Get hired as a Digital Marketing Expert"
        ],
        requirements: [
            "No experience required"
        ],
        lessons: [
            { title: "Market Research", content: "Finding your target audience.", videoUrl: "https://www.youtube.com/embed/F18X18eDklo" }
        ]
    },
    {
        title: "Instagram Marketing 2026: Complete Guide To Instagram Growth",
        description: "Attract Hyper-Targeted Instagram Followers, Convert Followers to Paying Customers, & Expand your Brand Using Instagram",
        price: 24.99,
        thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=1574&q=80",
        category: "Marketing",
        level: "All Levels",
        language: "English",
        learningOutcomes: [
            "Have a powerful Instagram account setup",
            "Attract 10,000 real followers",
            "Convert followers to customers"
        ],
        requirements: [
            "Instagram account"
        ],
        lessons: [
            { title: "Profile Optimization", content: "Creating a bio that converts.", videoUrl: "https://www.youtube.com/embed/V6H3K2g2f_M" }
        ]
    }
];

const seedDB = async () => {
    try {
        await Course.deleteMany();
        console.log('Courses cleared...');

        let admin = await User.findOne({ email: 'admin@example.com' });

        if (!admin) {
            admin = await User.create({
                name: 'Mentora Admin',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin'
            });
            console.log('Admin user created');
        }

        let student = await User.findOne({ email: 'student@example.com' });
        if (!student) {
            student = await User.create({
                name: 'Demo Student',
                email: 'student@example.com',
                password: 'password123',
                role: 'student'
            });
            console.log('Demo Student user created');
        }

        const coursesWithUser = coursesData.map(course => ({ ...course, user: admin._id }));

        await Course.insertMany(coursesWithUser);
        console.log(`Successfully seeded ${coursesWithUser.length} courses!`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
