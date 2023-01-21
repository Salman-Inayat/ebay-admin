// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: "bots",
    path: "/dashboard/bots",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "users",
    path: "/dashboard/users",
    icon: getIcon("eva:people-fill"),
  },
  {
    title: "payments",
    path: "/dashboard/payments",
    icon: getIcon("eva:credit-card-fill"),
  },
  {
    title: "posts",
    path: "/dashboard/posts",
    icon: getIcon("eva:file-text-fill"),
  },
];

export default navConfig;
