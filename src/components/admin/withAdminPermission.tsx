import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ComponentType } from "react";

const withAdminPermission = (WrappedComponent: ComponentType) => {
  const WithAdminPermission = (
    props: React.ComponentProps<typeof WrappedComponent>
  ) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin");

      if (!token || isAdmin !== "true") {
        // Redirect to the login page if the token is not present or user is not an admin
        router.push("/admin/login");
      }
    }, [router]);

    // Only render the wrapped component if the checks pass
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");

    if (!token || isAdmin !== "true") {
      return null; // Prevent rendering while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  WithAdminPermission.displayName = `WithAdminPermission(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAdminPermission;
};

export default withAdminPermission;
