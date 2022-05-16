import { default as frameworks } from "./constants/frameworks.json";

const detectFramework = (packageJson: any) => {
  const detectFramework = frameworks.find(
    (rx: { detector: string | RegExp }) => {
      const regex = new RegExp(rx.detector, "gm");
      return regex.test(JSON.stringify(packageJson));
    },
  );
  if (detectFramework) {
    return detectFramework;
  }
  return {
    name: "Other",
    slug: null,
    logo: "",
    description: "No framework detected.",
    settings: {
      installCommand: "yarn install",
      buildCommand: "yarn build",
      startCommand: "yarn start",
      outputDirectory: "public",
    },
  };
};

export default detectFramework;
