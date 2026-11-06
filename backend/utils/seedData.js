const { WellnessContent, User } = require('../models');
const sequelize = require('../config/db');

const wellnessData = [
    // Relaxation Music
    {
        title: "Weightless",
        description: "Ambient, Soft Instrumental, Scientific relaxation tones",
        type: "music",
        duration: "8:20",
        category: "Relaxation",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&h=300&fit=crop",
        tags: JSON.stringify(["ambient", "instrumental", "scientific"])
    },
    {
        title: "Watermark - Enya",
        description: "Soft Vocals + ambient Sound",
        type: "music",
        duration: "8:00",
        category: "Relaxation",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&h=300&fit=crop",
        tags: JSON.stringify(["vocals", "ambient", "enya"])
    },
    {
        title: "Strawberry Swing",
        description: "Chill pop, feel-good, light instrumental background",
        type: "music",
        duration: "10:00",
        category: "Relaxation",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&h=300&fit=crop",
        tags: JSON.stringify(["chill", "pop", "feel-good"])
    },
    // Guided Meditation
    {
        title: "Morning Meditation",
        description: "Start your day with positive energy",
        type: "meditation",
        duration: "10:00",
        category: "Beginner",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        tags: JSON.stringify(["morning", "energy", "beginner"])
    },
    {
        title: "Mindful Breathing",
        description: "Focus on your breath and be present",
        type: "meditation",
        duration: "11:00",
        category: "All Levels",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        imageUrl: "https://images.unsplash.com/photo-1499729132352-4a341c0e3932?w=800&q=80",
        tags: JSON.stringify(["breathing", "mindful", "presence"])
    },
    {
        title: "Body Relaxation",
        description: "Unwind your body and mind in nature",
        type: "meditation",
        duration: "14:00",
        category: "General",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
        tags: JSON.stringify(["relaxation", "calm", "nature"])
    },
    {
        title: "Daily Affirmations",
        description: "Positive self-talk for a better day",
        type: "affirmation",
        duration: "5:00",
        category: "Positive Thinking",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        imageUrl: "https://images.unsplash.com/photo-1502139214073-47f67554332c?w=800&q=80",
        tags: JSON.stringify(["affirmation", "positive", "daily"])
    },
    // NEW: Guided Meditation Video
    {
        title: "Guided Meditation Video",
        description: "A complete visual meditation for peace and clarity",
        type: "video",
        duration: "15:00",
        category: "Guided Video",
        audioUrl: "https://www.youtube.com/embed/uTN29kj7e-w",
        imageUrl: "https://img.youtube.com/vi/uTN29kj7e-w/maxresdefault.jpg",
        tags: JSON.stringify(["video", "guided", "peace", "youtube"])
    }
];

const communityData = [
    {
        name: "Healing Community '25",
        description: "A space for those beginning their journey in 2025.",
        illnessType: "Cancer Support",
        memberCount: 156,
        isPrivate: false
    },
    {
        name: "Mental Wellness Circle",
        description: "Supporting mental health and emotional wellbeing together.",
        illnessType: "Mental Health",
        memberCount: 342,
        isPrivate: false
    },
    {
        name: "Heart Health Warriors",
        description: "Connecting those managing cardiovascular conditions.",
        illnessType: "Cardiovascular",
        memberCount: 278,
        isPrivate: false
    },
    {
        name: "Diabetes Support Network",
        description: "Share tips, recipes, and support for diabetes management.",
        illnessType: "Diabetes",
        memberCount: 512,
        isPrivate: false
    },
    {
        name: "Chronic Pain Relief",
        description: "Finding comfort and solutions for chronic pain together.",
        illnessType: "Chronic Pain",
        memberCount: 445,
        isPrivate: false
    },
    {
        name: "Respiratory Care Community",
        description: "Support for asthma, COPD, and other respiratory conditions.",
        illnessType: "Respiratory",
        memberCount: 198,
        isPrivate: false
    },
    {
        name: "Autoimmune Alliance",
        description: "United in managing autoimmune conditions.",
        illnessType: "Autoimmune",
        memberCount: 367,
        isPrivate: false
    },
    {
        name: "Survivors Circle V1.0",
        description: "Connecting those who have overcome and are thriving.",
        illnessType: "Survivor",
        memberCount: 890,
        isPrivate: false
    },
    {
        name: "Hopeful Horizon",
        description: "Find peace and hope in shared stories.",
        illnessType: "Chronic Illness",
        memberCount: 423,
        isPrivate: false
    }
];

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced');

        await WellnessContent.bulkCreate(wellnessData);
        console.log(`${wellnessData.length} wellness items created`);

        const { Community } = require('../models');
        await Community.bulkCreate(communityData);
        console.log(`${communityData.length} community groups created`);

        // Create default user
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);

        await User.create({
            name: "hh",
            email: "hh@example.com",
            password: hashedPassword,
            supportType: "Cancer Support",
            avatar: "",
            bio: "Here to heal and help.",
            illnessType: "Survivor"
        });
        console.log('Default user created: hh@example.com / password123');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
