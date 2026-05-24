import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AwardsPage from './pages/Awards';
import CertificationsPage from './pages/Certifications';
import ContactPage from './pages/Contact';
import Dashboard from './pages/Dashboard';
import EducationPage from './pages/Education';
import ExperiencePage from './pages/Experience';
import Login from './pages/Login';
import ProfilePage from './pages/Profile';
import ProjectsPage from './pages/Projects';
import PublicationsPage from './pages/Publications';
import SkillsPage from './pages/Skills';
import UsersPage from './pages/Users';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/awards" element={<AwardsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
