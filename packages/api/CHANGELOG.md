# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-12-01)


### Bug Fixes

* removed comments from tsconfig.json to aviod JSON error ([f3d2718](https://github.com/brimblehq/brimble/commit/f3d2718561f6f2ba02e6089a1b3ef8d1c6ce93df))


### Features

* worked on the ability for users to get their projects ([a274661](https://github.com/brimblehq/brimble/commit/a27466145317af00ad05f5fa92d3fc31db197433))


### Performance Improvements

* found out error and status were useless ([e15aa79](https://github.com/brimblehq/brimble/commit/e15aa79ad6bb535fdb5d781b8095ed72365a6a54))



# 1.2.0-alpha.0 (2021-09-17)


### Bug Fixes

* added the any type on error since async catch can't have a defined type ([a5e27b9](https://github.com/brimblehq/brimble/commit/a5e27b933b624c39b08d01c3621caf4ed07e0133))


### Features

* worked on getting a repo ([9774bff](https://github.com/brimblehq/brimble/commit/9774bff3890deef4a464fe5b453847eb9cd28a5f)), closes [#6](https://github.com/brimblehq/brimble/issues/6)
* worked on getting branches of a repo ([916f023](https://github.com/brimblehq/brimble/commit/916f0239e09ec3dd46cb52c61672b508ce52e6ff)), closes [#7](https://github.com/brimblehq/brimble/issues/7)
* worked on getting package.json content and detecting framework ([f69ecd9](https://github.com/brimblehq/brimble/commit/f69ecd9de882b0ae72432873a1cc833465e3a0fe))


### Performance Improvements

* used .then for requests ([637c404](https://github.com/brimblehq/brimble/commit/637c404ec62226d37476eb63ccd648c6da0db0a1))


### BREAKING CHANGES

* 400x - 500x has been moved to catch block on all services



# 1.1.0 (2021-09-05)


### Features

* added models and worked on getting authenticated users ([8bfed20](https://github.com/brimblehq/brimble/commit/8bfed20803e3471dcfcab01398988a23ff0103a9))
* integrated github ([4f66b16](https://github.com/brimblehq/brimble/commit/4f66b165339382a303013bef7eda568e412e48d3))
* worked on getting and selecting repo ([bd38ade](https://github.com/brimblehq/brimble/commit/bd38ade7b2b8a374ae0293d840011d11ada99a5e))
* worked on searching for user repos ([db793f4](https://github.com/brimblehq/brimble/commit/db793f489216174d012ca2f900e54f9167111868)), closes [#5](https://github.com/brimblehq/brimble/issues/5)


### Performance Improvements

* added limit for easy pagination ([e271dc8](https://github.com/brimblehq/brimble/commit/e271dc84460c8302d094b439ef78eb22c4433709)), closes [#5](https://github.com/brimblehq/brimble/issues/5)
* added logger ([3ae7966](https://github.com/brimblehq/brimble/commit/3ae7966c27667323bfdb2f8bb7ceeb6cd7cc373e))
* created response format ([b4ba7da](https://github.com/brimblehq/brimble/commit/b4ba7da9dcb778445d9a953a1d3074e7ce42d5a2))
* flatten array ([030b385](https://github.com/brimblehq/brimble/commit/030b38510d858417a434641e405114b82cbb9cfa)), closes [#5](https://github.com/brimblehq/brimble/issues/5)
* handled error ([c1703b1](https://github.com/brimblehq/brimble/commit/c1703b1c11987377b407f1f0264b2c9e0a06411e)), closes [#5](https://github.com/brimblehq/brimble/issues/5)
* minor perf ([733bc61](https://github.com/brimblehq/brimble/commit/733bc61b0cc3ef2b7f85e7dfbd00243657f0a933))





# 1.1.0 (2021-09-05)


### Features

* added models and worked on getting authenticated users ([8bfed20](https://github.com/brimblehq/brimble/commit/8bfed20803e3471dcfcab01398988a23ff0103a9))
* integrated github ([4f66b16](https://github.com/brimblehq/brimble/commit/4f66b165339382a303013bef7eda568e412e48d3))
* worked on getting and selecting repo ([bd38ade](https://github.com/brimblehq/brimble/commit/bd38ade7b2b8a374ae0293d840011d11ada99a5e))
* worked on searching for user repos ([db793f4](https://github.com/brimblehq/brimble/commit/db793f489216174d012ca2f900e54f9167111868)), closes [#5](https://github.com/brimblehq/brimble/issues/5)


### Performance Improvements

* added limit for easy pagination ([e271dc8](https://github.com/brimblehq/brimble/commit/e271dc84460c8302d094b439ef78eb22c4433709)), closes [#5](https://github.com/brimblehq/brimble/issues/5)
* added logger ([3ae7966](https://github.com/brimblehq/brimble/commit/3ae7966c27667323bfdb2f8bb7ceeb6cd7cc373e))
* created response format ([b4ba7da](https://github.com/brimblehq/brimble/commit/b4ba7da9dcb778445d9a953a1d3074e7ce42d5a2))
* flatten array ([030b385](https://github.com/brimblehq/brimble/commit/030b38510d858417a434641e405114b82cbb9cfa)), closes [#5](https://github.com/brimblehq/brimble/issues/5)
* handled error ([c1703b1](https://github.com/brimblehq/brimble/commit/c1703b1c11987377b407f1f0264b2c9e0a06411e)), closes [#5](https://github.com/brimblehq/brimble/issues/5)
* minor perf ([733bc61](https://github.com/brimblehq/brimble/commit/733bc61b0cc3ef2b7f85e7dfbd00243657f0a933))
