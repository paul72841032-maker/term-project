import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";
import LoginPage from "./pages/LoginPage.vue";
import PostDetailPage from "./pages/PostDetailPage.vue";

export default createRouter({
    history: createWebHashHistory(), // ✅ 변경
    routes: [
        { path: "/", component: HomePage },
        { path: "/login", component: LoginPage },
        { path: "/posts/:id", component: PostDetailPage },
    ],
});
