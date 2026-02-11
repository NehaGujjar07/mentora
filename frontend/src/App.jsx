import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ResumeReport from './pages/ResumeReport';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSessionView from './pages/InterviewSessionView';
import InterviewReport from './pages/InterviewReport';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<CourseList />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/create-course" element={<CreateCourse />} />
              <Route path="/admin/edit-course/:id" element={<EditCourse />} />
            </Route>

            {/* Public Course Detail */}
            <Route path="/course/:id" element={<CourseDetail />} />

            {/* Protected Lesson View (Enrolled) */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
              <Route path="/lesson/:courseId" element={<LessonView />} />
            </Route>

            {/* Resume Analyzer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
              <Route path="/resume/analyzer" element={<ResumeAnalyzer />} />
              <Route path="/resume/report/:id" element={<ResumeReport />} />
              <Route path="/interview/setup" element={<InterviewSetup />} />
              <Route path="/interview/session/:id" element={<InterviewSessionView />} />
              <Route path="/interview/report/:id" element={<InterviewReport />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
