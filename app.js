const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');

const app = express();

// Security Middlewares
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(hpp());

// Define the Project Schema
const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        short_des: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// Create Student Model
const Project = mongoose.model('projects', projectSchema);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a Project
app.post('/api/project', async (req, res) => {
    try {
        const projectAdd = new Project({
            title: req.body.title,
            short_des: req.body.short_des,
            description: req.body.description,
            image: req.body.image,
        });
        await projectAdd.save();
        res.status(201).json({
            message: 'Project Created Successfully',
            data: projectAdd,
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a Server Side Error',
            reason: err.message,
        });
    }
});

// Get a Single Project
app.get('/api/project/:id', async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id });
        if (!project) {
            return res.status(404).json({
                message: 'No Project Found',
            });
        }
        res.status(200).json({
            message: 'Project Retrieved Successfully',
            data: project,
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a Server Side Error',
            reason: err.message,
        });
    }
});

// Update a Project
app.put('/api/project/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        if (!updatedProject) {
            return res.status(404).json({
                message: 'No Project Found',
            });
        }
        res.status(200).json({
            message: 'Project Updated Successfully',
            data: updatedProject,
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a Server Side Error',
            reason: err.message,
        });
    }
});

// Delete a Project
app.delete('/api/project/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete({
            _id: req.params.id,
        });
        if (!deletedProject) {
            return res.status(404).json({
                message: 'No Project Found',
            });
        }
        res.status(200).json({
            message: 'Project Deleted Successfully',
            data: deletedProject,
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a Server Side Error',
            reason: err.message,
        });
    }
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        const DATABASE_URI =
            'mongodb+srv://touhid:touhid1234@cluster0.advoc.mongodb.net/projectModel';
        await mongoose.connect(DATABASE_URI);
        console.log('Database Connection Success!');
    } catch (err) {
        console.error('Database Connection Failed!');
        console.error(`Reason: ${err.message}`);
        process.exit(1);
    }
};
connectDB();

// 404 Handler
app.use((req, res, next) => {
    res.status(404).send('Bad URL Request: Page Not Found');
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});
