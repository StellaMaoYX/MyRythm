import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { ChatHistoryPage } from "./components/ChatHistoryPage";
import { ChatConversationPage } from "./components/ChatConversationPage";
import { InsightsPage } from "./components/InsightsPage";
import { InsightChatPage } from "./components/InsightChatPage";
import { ProfilePage } from "./components/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "chat", Component: ChatHistoryPage },
      { path: "insights", Component: InsightsPage },
      { path: "signals", Component: ProfilePage },
    ],
  },
  // Full-screen pages without nav bar
  { path: "/chat/insight/:insightId", Component: InsightChatPage },
  { path: "/chat/:threadId", Component: ChatConversationPage },
]);