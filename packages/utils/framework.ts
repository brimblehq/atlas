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
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run brimble-build` or `npm run build`",
        value: null,
      },
      devCommand: {
        placeholder: "None",
        value: null,
      },
      outputDirectory: {
        placeholder: "`public` if it exists, or `.`",
      },
    },
  };
};

export default detectFramework;
