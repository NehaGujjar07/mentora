const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: { type: String, required: true },
    freePreview: { type: Boolean, default: false }
});

const courseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels'
    },
    language: {
        type: String,
        default: 'English'
    },
    learningOutcomes: [{
        type: String
    }],
    requirements: [{
        type: String
    }],
    lessons: [lessonSchema]
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
