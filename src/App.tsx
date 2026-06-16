import { Navigate, Route, Routes } from 'react-router-dom'
import PermissionRoute from '@/components/auth/PermissionRoute'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import { PERMISSIONS } from '@/lib/permissions'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'
import UsersPage from '@/pages/UsersPage'
import WorkspacesPage from '@/pages/WorkspacesPage'
import OverviewPage from '@/pages/projects/OverviewPage'
import BacklogPage from '@/pages/projects/BacklogPage'
import SprintPage from '@/pages/projects/SprintPage'
import BoardPage from '@/pages/projects/BoardPage'
import IssuesPage from '@/pages/projects/IssuesPage'
import MembersPage from '@/pages/projects/MembersPage'
import SettingsPage from '@/pages/projects/SettingsPage'
import ProfilePage from '@/pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/workspaces" replace />} />
          <Route path="workspaces" element={<WorkspacesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route element={<PermissionRoute permission={PERMISSIONS.USERS_READ} />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
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
