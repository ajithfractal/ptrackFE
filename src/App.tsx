import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import LoginPage from '@/pages/LoginPage'
import WorkspacesPage from '@/pages/WorkspacesPage'
import OverviewPage from '@/pages/projects/OverviewPage'
import BacklogPage from '@/pages/projects/BacklogPage'
import SprintPage from '@/pages/projects/SprintPage'
import BoardPage from '@/pages/projects/BoardPage'
import IssuesPage from '@/pages/projects/IssuesPage'
import MembersPage from '@/pages/projects/MembersPage'
import SettingsPage from '@/pages/projects/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/workspaces" replace />} />
          <Route path="workspaces" element={<WorkspacesPage />} />
          <Route path="projects" element={<Navigate to="/projects/overview" replace />} />
          <Route path="projects/overview" element={<OverviewPage />} />
          <Route path="projects/backlog" element={<BacklogPage />} />
          <Route path="projects/sprint" element={<SprintPage />} />
          <Route path="projects/board" element={<BoardPage />} />
          <Route path="projects/issues" element={<IssuesPage />} />
          <Route path="projects/members" element={<MembersPage />} />
          <Route path="projects/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
