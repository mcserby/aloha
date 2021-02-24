import { createWebHistory, createRouter } from "vue-router";
import Main from "@/components/Main.vue";
import Project from "@/components/Project.vue";
import ProjectCreator from "@/components/ProjectCreator.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/project/:projectId",
    name: "Project",
    component: Project,
  },
  {
    path: "/project/new",
    name: "ProjectCreator",
    component: ProjectCreator,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
