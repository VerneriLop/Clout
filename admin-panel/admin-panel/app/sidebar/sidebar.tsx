import { NavLink } from "react-router";

const Sidebar = () => {
  const navItems = [
    { name: "Competitions", path: "/competition" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="h-screen w-64 bg-neutral-950 text-white flex flex-col justify-between border-r border-neutral-700">
      <div className="p-4 space-y-2">
        <h2 className="text-2xl font-semibold mb-4 text-left">Clout Admin</h2>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded hover:bg-gray-700 transition ${
                isActive ? "bg-gray-800 font-bold" : ""
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Logout at bottom */}
      <div className="p-2 border-t border-neutral-700">
        <button
          onClick={() => console.log("Logout")}
          className="w-full text-left px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
