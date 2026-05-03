## [1.4.1](https://github.com/nhcuongng/FintBadmintonBot/compare/v1.4.0...v1.4.1) (2026-05-03)


### Bug Fixes

* update GitHub Actions workflow to use PAT for releases and add job summary ([afc611c](https://github.com/nhcuongng/FintBadmintonBot/commit/afc611c297186f218e2276dec0fda0b5892bee2e))

# [1.4.0](https://github.com/nhcuongng/FintBadmintonBot/compare/v1.3.2...v1.4.0) (2026-05-03)


### Bug Fixes

* add sleep before curl command to ensure service is ready ([ce59834](https://github.com/nhcuongng/FintBadmintonBot/commit/ce5983486fa29b758fac71d4e566c9afef5888bf))
* add volume definition for db-caulongbot in Docker Compose configuration ([d68d11d](https://github.com/nhcuongng/FintBadmintonBot/commit/d68d11d6d0c9d7ec8d5ef49b74f09e5f5ac8655f))
* change github event to push tag ([509c3de](https://github.com/nhcuongng/FintBadmintonBot/commit/509c3dea2b07a1a452bd357a70e53a4b1a004112))
* change to right env github action ([e2401b4](https://github.com/nhcuongng/FintBadmintonBot/commit/e2401b4d3abc237fe1aa8cb32b8ed4c3e0d1c029))
* correct syntax for NODE_ENV variable in Dockerfile ([f068a55](https://github.com/nhcuongng/FintBadmintonBot/commit/f068a55fa3f872eace35d73fb18d2f93d1bf667d))
* correct volume path in Docker Compose configuration ([8586f77](https://github.com/nhcuongng/FintBadmintonBot/commit/8586f77715c92e42c699e03c52e973c711109d8d))
* create JSON directory and set ownership during build process ([5fcbdee](https://github.com/nhcuongng/FintBadmintonBot/commit/5fcbdee0726ea4c49de92281380b10516429c9d2))
* create JSON directory in dist/db and set ownership for proper access ([b167bfd](https://github.com/nhcuongng/FintBadmintonBot/commit/b167bfd4c771101a2d4f1d7d95688fac1ecffa62))
* create JSON directory in final stage and set ownership for non-root user ([6031da1](https://github.com/nhcuongng/FintBadmintonBot/commit/6031da1776f22e22494306d7f277631dc972a6e3))
* simplify file path handling in JsonDatabase and server ([5938509](https://github.com/nhcuongng/FintBadmintonBot/commit/5938509ac1a340c5480e8acbad64af04476a5351))
* update BOT_TOKEN to use secrets in CI/CD configuration ([2a725b7](https://github.com/nhcuongng/FintBadmintonBot/commit/2a725b7a3e0c8ec331dcce2e04f72f5a12e031f5))
* update curl command to use environment variable for PORT ([f58a781](https://github.com/nhcuongng/FintBadmintonBot/commit/f58a781cac467335cb46895b0be2dee2a4a38af1))
* update deployment configuration to use dynamic PORT variable ([2c6b6ef](https://github.com/nhcuongng/FintBadmintonBot/commit/2c6b6efce12df7929bff00eb6cac38dcc4a45aa0))
* update Dockerfile to change ownership of built files and remove unused volume in Docker Compose ([5d341c9](https://github.com/nhcuongng/FintBadmintonBot/commit/5d341c9a2b4df485ec4fc74af93377c7a9e61c49))
* update Dockerfile to create JSON directory and set ownership in final stage ([c6c3b28](https://github.com/nhcuongng/FintBadmintonBot/commit/c6c3b285dd18be754494b590d1c6715632641706))
* update file paths to use ROOT_PATH for better maintainability and consistency ([a93d878](https://github.com/nhcuongng/FintBadmintonBot/commit/a93d878a51487423d94bc61e46face59fad50626))
* update JSON directory paths in Dockerfile and Docker Compose configurations ([db472fa](https://github.com/nhcuongng/FintBadmintonBot/commit/db472fa205219c8ac5fd020f8936b8c9dec27994))
* update ownership of JSON directory in Dockerfile and add volume for JSON data in Docker Compose ([eb3bb00](https://github.com/nhcuongng/FintBadmintonBot/commit/eb3bb00fdd7caf6dbfdee1d889e193def91c2c3a))
* update volume definition for db-caulongbot in Docker Compose configuration ([a506d39](https://github.com/nhcuongng/FintBadmintonBot/commit/a506d39b5db3f725e0c23a0fd7a376472d8bf6ce))
* update volume path in Docker Compose configuration ([f095376](https://github.com/nhcuongng/FintBadmintonBot/commit/f0953768d5261af793f8cb6345ed58483c877700))
* update volume permissions in Docker Compose and correct file path in JsonDatabase ([027bab5](https://github.com/nhcuongng/FintBadmintonBot/commit/027bab5087c0a692937f5a27d30d1d89f932db05))


### Features

* add Docker support with CI/CD configuration and Dockerfile ([ba23dbb](https://github.com/nhcuongng/FintBadmintonBot/commit/ba23dbbc508c430665bacae1546920b54f3fb584))

## [1.3.2](https://github.com/nhcuongng/FintBadmintonBot/compare/v1.3.1...v1.3.2) (2025-10-20)


### Bug Fixes

* add credenticals.json to git ignore ([cd00379](https://github.com/nhcuongng/FintBadmintonBot/commit/cd0037962490a280f39d156d446be088821d79ff))
* change to lazy import excel list ([d02190b](https://github.com/nhcuongng/FintBadmintonBot/commit/d02190b9ad423fef0594261d1a70cb4d6c5c518d))
* ci environment ([8288c70](https://github.com/nhcuongng/FintBadmintonBot/commit/8288c7011d920638e879e1305ec95551765f8d37))
* comment collect money ([363c291](https://github.com/nhcuongng/FintBadmintonBot/commit/363c291de5fc3d20d6c7c399129ba2efa7817622))
* comment the code for send collection ([19b797b](https://github.com/nhcuongng/FintBadmintonBot/commit/19b797ba296642055f9c81aceb8c817732c13ac1))


### Reverts

* Revert "Revert "feat: send notification for collect money monthly base on excel file"" ([dbfd939](https://github.com/nhcuongng/FintBadmintonBot/commit/dbfd939568bdd422bc1755932acc2ea5ad97cae2))

## [1.3.1](https://github.com/nhcuongng/FintBadmintonBot/compare/v1.3.0...v1.3.1) (2025-09-26)


### Reverts

* Revert "feat: send notification for collect money monthly base on excel file" ([6ae1b55](https://github.com/nhcuongng/FintBadmintonBot/commit/6ae1b55e59c83d5a177cc539a69899345ef363d9))

# [1.3.0](https://github.com/nhcuongng/FintBadmintonBot/compare/v1.2.1...v1.3.0) (2025-09-22)


### Bug Fixes

* cannot pinned in cron task ([e299b4a](https://github.com/nhcuongng/FintBadmintonBot/commit/e299b4a7962a38f54cb133ac21be513bc47e0cd1))


### Features

* auto pin poll as a admin ([1b011b4](https://github.com/nhcuongng/FintBadmintonBot/commit/1b011b43c44bdcd489125d80ca2aa3ef9e0e86b9))
* send notification for collect money monthly base on excel file ([59b07e4](https://github.com/nhcuongng/FintBadmintonBot/commit/59b07e43004e2d95702abd28eebf889527af9a29))

## [1.2.1](https://github.com/nhcuongng/FintBadmintonBot/compare/v1.2.0...v1.2.1) (2025-09-15)


### Bug Fixes

* **cron:** handle send poll acting with schedule plus range day ([b1bdf74](https://github.com/nhcuongng/FintBadmintonBot/commit/b1bdf74020abce3740587dc65bd1489f4fa96235))
* **send-poll:** send poll manually with more extracly ([7dbadc5](https://github.com/nhcuongng/FintBadmintonBot/commit/7dbadc5b7ca15d2214482a5065a6f7b9fea98e3e))

# [1.2.0](https://github.com/nhcuongng/FintBadmintonBot/compare/v1.1.0...v1.2.0) (2025-09-13)


### Bug Fixes

* **bot:** enhance reply option and restrict rule ([fd86014](https://github.com/nhcuongng/FintBadmintonBot/commit/fd86014f4cb95e69b3774d64b637b8c7f1ca33e7))
* **cron:** timezone in cron parser ([fe3e2f2](https://github.com/nhcuongng/FintBadmintonBot/commit/fe3e2f25b80bcd87de8b6951f4dbd2d69c129e23))


### Features

* **web:** add a basic webpage for show and handle some action ([4717437](https://github.com/nhcuongng/FintBadmintonBot/commit/4717437abba7d53bd25863a33b6370319e604bc8))

# [1.1.0](https://github.com/nhcuongng/FintBadmintonBot/compare/v1.0.0...v1.1.0) (2025-08-23)


### Bug Fixes

* **bot:** change bot token dev and compact workflow ([57e4de4](https://github.com/nhcuongng/FintBadmintonBot/commit/57e4de40a0c26f84342e7219a4f1e9366a7defb5))
* **bot:** change bot token dev and compact workflow ([09f1caa](https://github.com/nhcuongng/FintBadmintonBot/commit/09f1caa122547d627c67cc288e948a34b0be06b3))
* **bot:** check bot can execute cron job by json file ([d07a8ca](https://github.com/nhcuongng/FintBadmintonBot/commit/d07a8ca74325e11cce82a8426bf85e1a8c5cdc7b))
* **ci:** make work folder when does not exist ([9431ef5](https://github.com/nhcuongng/FintBadmintonBot/commit/9431ef5b18f98a6bcb3a37dfb316b5598de75a1a))
* **cron:** cleanup previous cron job when select new day ([2dd73c1](https://github.com/nhcuongng/FintBadmintonBot/commit/2dd73c1da32a1c53e1fc9a0d4ee7e154ca21d10c))


### Features

* **cron:** restart cron when deploy ([62f3ecd](https://github.com/nhcuongng/FintBadmintonBot/commit/62f3ecda81836c4d77a1a43248adc044b6811aad))
* **gateway:** not use poll controller only, use gateway alternatively ([75323f2](https://github.com/nhcuongng/FintBadmintonBot/commit/75323f2a5560c1d051b142191fccaada1c2aee34))
* **semver:** add semver release package ([95a7157](https://github.com/nhcuongng/FintBadmintonBot/commit/95a71577f60d943fd95df22c58f741ac0bf00f15))
* **topic:** support topic of supergroup ([8c7ad46](https://github.com/nhcuongng/FintBadmintonBot/commit/8c7ad462457d05f47d23de940cb49a9d20e26159))

# 1.0.0 (2025-08-17)


### Bug Fixes

* **bot:** change bot token dev and compact workflow ([1a3525e](https://github.com/nhcuongng/FintBadmintonBot/commit/1a3525e091909ea892e752ed593519222bfd7842))
* **bot:** check permission ([c76413a](https://github.com/nhcuongng/FintBadmintonBot/commit/c76413af651d413bdbda2d6fbe2a9cb3e01a6960))
* **chatid:** rename for more readable ([d90964c](https://github.com/nhcuongng/FintBadmintonBot/commit/d90964c38019da5fadeb51bbecbfeefd8ba2d087))
* **ci:** build and deploy to my vultr server with secret env ([2a98edf](https://github.com/nhcuongng/FintBadmintonBot/commit/2a98edf6121b67bd41f3308d7f0d278c8bde140f))
* **ci:** check process pm2 start or restart when necessary ([bf94cfa](https://github.com/nhcuongng/FintBadmintonBot/commit/bf94cfa8107e90e29b2f5cbba2f38a97b8641198))
* **ci:** comment out npm test ([48138ac](https://github.com/nhcuongng/FintBadmintonBot/commit/48138ac811578e11001ac61b626d0b3a8da26ae1))
* **ci:** make work folder when does not exist ([966f5ec](https://github.com/nhcuongng/FintBadmintonBot/commit/966f5ecd51fe36b30deb0e06ace7dc5fdff04fd5))
* **ci:** type secrets ([cb34c78](https://github.com/nhcuongng/FintBadmintonBot/commit/cb34c7822067b2d5e113a4695927ba11689005a3))
* **ci:** typo ([a345393](https://github.com/nhcuongng/FintBadmintonBot/commit/a34539320b5dde92972eb67dabd783d43d3868f0))
* **cron:** cleanup previous cron job when select new day ([d71aff7](https://github.com/nhcuongng/FintBadmintonBot/commit/d71aff7abdef7ff30cbe0281a1a1fcea5df1367d))
* **eslint:** missing comma ([1cd6fb1](https://github.com/nhcuongng/FintBadmintonBot/commit/1cd6fb198922f711906ccb7d0396facd4c52d41d))


### Features

* **ci:** init develop workflow ([47ed70c](https://github.com/nhcuongng/FintBadmintonBot/commit/47ed70c7dbe42e8b5f377345db91b507fa1a029e))
* **ci:** setup scp ([852e787](https://github.com/nhcuongng/FintBadmintonBot/commit/852e787e63caaacc2f442da91ab98b87b035bafc))
* **eslint:** initial setup ([38563f8](https://github.com/nhcuongng/FintBadmintonBot/commit/38563f8239075d34c00ad7acc14379fbe576964e))
* **init:** first prototype ([b8bbbfe](https://github.com/nhcuongng/FintBadmintonBot/commit/b8bbbfec924bd83a742672ec37e3ed42d9d76154))
* **semver:** add semver release package ([07f9f71](https://github.com/nhcuongng/FintBadmintonBot/commit/07f9f71cbe5e73d235aa5e333d047ea902a704e0))
* **server:** add a basic server for simple testing ([7e2c0fe](https://github.com/nhcuongng/FintBadmintonBot/commit/7e2c0fe4912e48ff61dac7a347ede7b84a425fd7))
* **topic:** support topic of supergroup ([30867d8](https://github.com/nhcuongng/FintBadmintonBot/commit/30867d83e1ebcd45b8e3babe1de094398265e00f))
