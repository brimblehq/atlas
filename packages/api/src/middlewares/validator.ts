import { query, ValidationChain, validationResult } from "express-validator";
import { NextFunction, Response } from "express";

type CallbackFunction = (...args: any[]) => any;

const validate = (validations: CallbackFunction) => {
  return async (req: any, res: Response, next: NextFunction) => {
    await Promise.all(
      validations(req).map((validation: any) => validation.run(req)),
    );

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
  };
};

const frameworkRequest = (): ValidationChain[] => {
  return [
    query("git_provider", "A git provider is required")
      .notEmpty()
      .custom((value): boolean =>
        ["GITHUB", "GITLAB", "BITBUCKET"].includes(value.toUpperCase()),
      )
      .withMessage("Please provide valid git provider"),
    query("repo_name", "Repo name is required").notEmpty().isString(),
    query("branch", "Branch is required").notEmpty().isString(),
    query("path").optional().isString(),
  ];
};

export { validate, frameworkRequest };
