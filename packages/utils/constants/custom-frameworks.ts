const dockerFramework = {
  name: "Docker",
  slug: "docker",
  logo: "https://res.cloudinary.com/dgqfojhx4/image/upload/v1728899289/brimble-assets/aedzr3gaxh3x8cdm1cxn.svg",
  description: "A Docker-based project.",
  settings: null,
  envPrefix: "",
  type: "docker",
};

const laravelFramework = {
  name: "Laravel",
  slug: "laravel",
  logo: "https://res.cloudinary.com/dgqfojhx4/image/upload/v1740527040/brimble-assets/Laravel_2_ebiycx.svg",
  description:
    "A PHP web application framework with expressive, elegant syntax.",
  website: "https://laravel.com",
  detector: null,
  settings: {
    installCommand: "composer install --ignore-platform-reqs && npm ci",
    buildCommand: "php artisan migrate && npm run build",
    startCommand: "mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions && chmod -R 775 storage && php artisan storage:link && php artisan serve --host=0.0.0.0 --port=8000",
    outputDirectory: "public",
  },
  envPrefix: "",
  type: "backend",
};

const golangFramework = {
  name: "Golang",
  slug: "golang",
  logo: "https://res.cloudinary.com/dgqfojhx4/image/upload/v1740527295/brimble-assets/go_vmflt9.svg",
  description: "Build fast, reliable, and efficient software at scale.",
  website: "https://golang.org",
  detector: null,
  settings: {
    installCommand: "go mod download",
    buildCommand: "go build -o app",
    startCommand: "./app",
    outputDirectory: "",
  },
  envPrefix: "",
  type: "backend",
};

const pythonFramework = {
  name: "Python",
  slug: "python",
  logo: "https://res.cloudinary.com/dgqfojhx4/image/upload/v1740527273/brimble-assets/python_gfcs1m.svg",
  description:
    "A programming language that lets you work quickly and integrate systems effectively.",
  website: "https://python.org",
  detector: null,
  settings: {
    installCommand: "pip install -r requirements.txt",
    buildCommand: "",
    startCommand: "python app.py",
    outputDirectory: "",
  },
  envPrefix: "PYTHON_",
  type: "backend",
};

export { laravelFramework, golangFramework, pythonFramework, dockerFramework };
