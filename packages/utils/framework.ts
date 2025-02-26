import { default as frameworks } from "./constants/frameworks.json";

import { dockerFramework, laravelFramework, golangFramework, pythonFramework } from "./constants/custom-frameworks"


const detectFramework = (packageJson: any, isDocker = false, files: string[] = []) => {
  if (isDocker) return dockerFramework;

  if (packageJson) {
    const detectFramework = frameworks.find(
      (rx: { detector: string | RegExp | null }) => {
        if (rx.detector) {
          const regex = new RegExp(rx.detector, "gm");
          return regex.test(JSON.stringify(packageJson));
        }
        return false;
      }
    );

    if (detectFramework) return detectFramework;
  }

  if (files.includes('composer.json') && (files.includes('artisan') && files.some(file => file.endsWith('.php')) || files.includes('app/Http/Controllers'))) {
    return laravelFramework;
  }

  if (files.includes('go.mod') || files.includes('main.go')) {
    return golangFramework;
  }

  if (files.includes('requirements.txt') || files.includes('setup.py') || files.includes('main.py') || files.includes('Pipfile') || files.some(file => file.endsWith('.py'))) {
    return pythonFramework;
  }

  return frameworks.find((framework) => framework.slug === "nodejs");
};

const allFrameworks = frameworks.map((framework: any) => {
  return {
    name: framework.name,
    slug: framework.slug,
    logo: framework.logo,
    description: framework.description,
    settings: {
      installCommand: framework.settings.installCommand,
      startCommand: framework.settings.startCommand,
      buildCommand: framework.settings.buildCommand,
      outputDirectory: framework.settings.outputDirectory,
    },
    envPrefix: framework.envPrefix,
    type: framework.type,
  };
});

allFrameworks.push(dockerFramework as any);
allFrameworks.push(laravelFramework);
allFrameworks.push(golangFramework);
allFrameworks.push(pythonFramework);

export { detectFramework, allFrameworks };