import { Component, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorFallback } from "./components/ErrorFallback";
import Home from "./pages/Home/Home";
import Albums from "./pages/Albums/Albums";
import Lists from "./pages/Lists/Lists";
import Profile from "./pages/Profile/Profile";
import Reviews from "./pages/Reviews/Reviews";
import Settings from "./pages/Settings/Settings";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import GoogleCallback from "./pages/Auth/GoogleCallback";
import AlbumDetail from "./pages/AlbumDetail/AlbumDetail";
import ArtistDetail from "./pages/ArtistDetail/ArtistDetail";
import ReviewDetail from "./pages/ReviewDetail/ReviewDetail";
import Search from "./pages/Search/Search";
import CreateReview from "./pages/CreateReview/CreateReview";
import EditReview from "./pages/EditReview/EditReview";
import CreateList from "./pages/Lists/CreateList";
import EditList from "./pages/Lists/EditList";
import ListDetail from "./pages/Lists/ListDetail";
import Recommend from "./pages/Recommend/Recommend";
import About from "./pages/About/About";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import Contact from "./pages/Contact/Contact";
import { useAuth } from "./context/useAuth";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback message={(this.state.error as Error).message} />;
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === "loading") return null;
  if (status === "anon") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ProfileRedirect() {
  const { user, status } = useAuth();
  if (status === "loading") return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/profile/${user.username}`} replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/albums" element={<Albums />} />
        <Route path="/albums/:id" element={<AlbumDetail />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
        <Route
          path="/reviews/:id"
          element={
            <ProtectedRoute>
              <ReviewDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews/:id/edit"
          element={
            <ProtectedRoute>
              <EditReview />
            </ProtectedRoute>
          }
        />
        <Route path="/search" element={<Search />} />
        <Route
          path="/reviews/new"
          element={
            <ProtectedRoute>
              <CreateReview />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<ProfileRedirect />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/lists/:id" element={<ListDetail />} />
        <Route
          path="/lists/new"
          element={
            <ProtectedRoute>
              <CreateList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists/:id/edit"
          element={
            <ProtectedRoute>
              <EditList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommend"
          element={
            <ProtectedRoute>
              <Recommend />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </ErrorBoundary>
  );
}
