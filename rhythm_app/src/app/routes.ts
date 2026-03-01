import { createBrowserRouter } from "react-router";
import { Layout } from "./components/app-layout";
import { HomePage } from "./components/home-page";
import { ChatPage } from "./components/chat-page";
import { ChatConversationPage } from "./components/chat-conversation-page";
import { InsightsPage } from "./components/insights-page";
import { InsightChatPage } from "./components/insight-chat-page";
import { ProfilePage } from "./components/profile-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "chat", Component: ChatPage },
      { path: "insights", Component: InsightsPage },
      { path: "signals", Component: ProfilePage },
    ],
  },
  { path: "/chat/insight/:insightId", Component: InsightChatPage },
  { path: "/chat/:threadId", Component: ChatConversationPage },
]);
