import { createWebHistory, createRouter } from "vue-router";
import Main from "@/components/Main.vue";
import Project from "@/components/Project.vue";
import ProjectCreator from "@/components/ProjectCreator.vue";
import Test from "@/components/Test.vue";
import ThankYou from "@/components/ThankYou.vue";
import Solutions from "@/components/Solutions.vue";
import Solution from "@/components/Solution.vue";
import EvaluationOver from "@/components/EvaluationOver.vue";

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
  {
    path: "/test/:testId",
    name: "Test",
    component: Test,
  },
  {
    path: "/solutions/:projectId",
    name: "Solutions",
    component: Solutions,
  },
  {
    path: "/solution/:solutionId",
    name: "Solution",
    component: Solution,
  },
  {
    path: "/thankyou/:firstName",
    name: "ThankYou",
    component: ThankYou,
  },
  {
    path: "/evaluationover",
    name: "EvaluationOver",
    component: EvaluationOver,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
