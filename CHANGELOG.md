# [0.2.0](https://github.com/hei-school/hei-admin-ui/compare/v0.1.0...v0.2.0) (2022-07-13)


### Bug Fixes

* add login jpg 100k and 50k ([158b903](https://github.com/hei-school/hei-admin-ui/commit/158b903071f69ae59343b7d9bafa2e8d6d3b4889))
* add ts dependency ([8b76ea3](https://github.com/hei-school/hei-admin-ui/commit/8b76ea3440ea0959819d1262c17de8bdbf1aa110))
* API url is env dependent ([eb5ae71](https://github.com/hei-school/hei-admin-ui/commit/eb5ae71d176e5390fef4cfa46c2dd48d92768679)), closes [#26](https://github.com/hei-school/hei-admin-ui/issues/26)
* authProvider correctly caches whoami data in sessionStorage ([2fc8265](https://github.com/hei-school/hei-admin-ui/commit/2fc82651d72ab28d49f48f2cd3953bbae4dc86ca))
* clean conf.js ([7a3f40c](https://github.com/hei-school/hei-admin-ui/commit/7a3f40c1369e43e71459902ffde86bdb29f88716))
* create fees is visible to manager only ([8d5be00](https://github.com/hei-school/hei-admin-ui/commit/8d5be0052ccf41740ed5fb8ce6659cb8ca693b59))
* display LoginForm only for small screens ([48b6a62](https://github.com/hei-school/hei-admin-ui/commit/48b6a62011d59003878c6d51364cf8e554bf79a1))
* display LoginForm only for small screens ([a1d9c93](https://github.com/hei-school/hei-admin-ui/commit/a1d9c9385355236e485462402b8b251519a145b8))
* do not let non-implemented buttons crash in student view ([3e1dd7b](https://github.com/hei-school/hei-admin-ui/commit/3e1dd7b1aaa22964dbc1411904c18f226763ae4f))
* feeList.showButton redirects to /fees/{id}/show ([98dd2b9](https://github.com/hei-school/hei-admin-ui/commit/98dd2b9c0d0b3aab5ecea4a44fb19e629eca8e01))
* limit LoginForm for too large screens ([5984a4b](https://github.com/hei-school/hei-admin-ui/commit/5984a4bc84b0ae0ec172a75f77193d64bc5f4549))
* logo-bg --> login-bg ([b1eaa50](https://github.com/hei-school/hei-admin-ui/commit/b1eaa508e5544a6199551cc7fb1313f0145295f2))
* password change ([62b2554](https://github.com/hei-school/hei-admin-ui/commit/62b25547101153bc3bdd79636c8d56360ae05095))
* password change ([985f86f](https://github.com/hei-school/hei-admin-ui/commit/985f86ff9277741eb19c02d8af9ac3f46e287c14))
* perPage cannot exceed 500 ([2a0dab3](https://github.com/hei-school/hei-admin-ui/commit/2a0dab3ae7e49d01e3f237f2e8fa0175c25c147f))
* rendering for mobile and pwa ([647a84e](https://github.com/hei-school/hei-admin-ui/commit/647a84ee72e6ce208b20381328e94dcdd01d6e10))
* studentProvider makes right api call ([267dc60](https://github.com/hei-school/hei-admin-ui/commit/267dc6046a5fe9bdd2a908d456c864c0f4005782))
* StudentShow.actions is only defined for managers ([4ab6a43](https://github.com/hei-school/hei-admin-ui/commit/4ab6a438dbfc04115ba9705d549e0c741696e757))
* use ProfileEdit for all users ([33b899f](https://github.com/hei-school/hei-admin-ui/commit/33b899fc1514d5ba716e062b5257bc168a601ce4))
* use ProfileLayout for showing all users ([cd27bb3](https://github.com/hei-school/hei-admin-ui/commit/cd27bb35c6cce54e980dde3d3dc9cfc173e7ce39))
* validate password change with cognito criterias ([d2fd139](https://github.com/hei-school/hei-admin-ui/commit/d2fd139b5e21dc3cea41dc07095fe76a7380950d))


### Features

* add user filtering ([849a437](https://github.com/hei-school/hei-admin-ui/commit/849a437bdb31f8b3f784bb67387328cb156d138a))
* all screens made publicly visitable with guesser components ([2234f04](https://github.com/hei-school/hei-admin-ui/commit/2234f04b7ab2e8bcbe3591ca909b7fc3950aad7c))
* auth using ra-auth ([7c3fc2b](https://github.com/hei-school/hei-admin-ui/commit/7c3fc2b9909827444d26df34df836af58d087b91))
* autofill predefined feesConf ([30e8a16](https://github.com/hei-school/hei-admin-ui/commit/30e8a1632455470599685c638f2339d02a564031))
* back button ([d1cfb1c](https://github.com/hei-school/hei-admin-ui/commit/d1cfb1c741fb494c218a66b5ed0210b5514ddd09))
* ByStatusFeeList ([ac1862f](https://github.com/hei-school/hei-admin-ui/commit/ac1862fdff2578c128d8a2953b25521e1ff845c8))
* change password on first login ([9a79cca](https://github.com/hei-school/hei-admin-ui/commit/9a79ccae59a18376977e3186d9ca1a17deb079b2)), closes [#27](https://github.com/hei-school/hei-admin-ui/issues/27)
* change request on profile ([35984d0](https://github.com/hei-school/hei-admin-ui/commit/35984d049a8e4a2e5d38313c699ea734d91e5304))
* contact is in footer ([b2f0c38](https://github.com/hei-school/hei-admin-ui/commit/b2f0c38d374f4d10084fd5e8fa14264b1a4115a5))
* create fees with manual fields ([fb220cc](https://github.com/hei-school/hei-admin-ui/commit/fb220cc9062d3dd4a0a0deea9ad69d5e516093a6))
* fancy login page ([7b1dc51](https://github.com/hei-school/hei-admin-ui/commit/7b1dc51242db589b76c2e8dcf9be6940d3d1d0ba))
* fee creation form, validation only, no call to API ([ad4be3b](https://github.com/hei-school/hei-admin-ui/commit/ad4be3bf82bb6d98b5e21717e76e0e1f897d6227))
* filter users ([1cdbbdf](https://github.com/hei-school/hei-admin-ui/commit/1cdbbdf5fdeb78da850679233b75674fafb370ec))
* generated haClient ([4d4334c](https://github.com/hei-school/hei-admin-ui/commit/4d4334cf97439a9279cfba31452898d501a42baf))
* GET /student-timetable and /student-grades ([4960da2](https://github.com/hei-school/hei-admin-ui/commit/4960da2d9600619ec702f03d726df2e2440e6aa3))
* manager can list fees of a specific student ([5556210](https://github.com/hei-school/hei-admin-ui/commit/55562106d39a9fc8d5f57d32b8ba27242fb9976d))
* pagination ([3e64bd9](https://github.com/hei-school/hei-admin-ui/commit/3e64bd930426a5714d48dac57543832baba02c65))
* payements ([223a300](https://github.com/hei-school/hei-admin-ui/commit/223a3008e83903a3088c04e4c3aa651f6d6af359))
* put profile in react-admin store ([4946142](https://github.com/hei-school/hei-admin-ui/commit/4946142d4c8f51c0d1e5e0eed47742ccf5e627f7))
* rbac ([c07cb4c](https://github.com/hei-school/hei-admin-ui/commit/c07cb4c3c78227f351f8c90564b60ca3aa9f4194))
* ShowProfile ([34d3188](https://github.com/hei-school/hei-admin-ui/commit/34d3188ec603e7415c135c6084d35135817d1be8))
* student can list fees ([003a95a](https://github.com/hei-school/hei-admin-ui/commit/003a95abc2f424ee008989decb4535ca8a11f2a6))
* use HEI favicon ([920bffa](https://github.com/hei-school/hei-admin-ui/commit/920bffa4febd773db6429e59d7628e95d3a3bc00))
* users UI ([519f6ff](https://github.com/hei-school/hei-admin-ui/commit/519f6ff97af94b8f9752e23ed130fd610c6679f5))



# [0.1.0](https://github.com/hei-school/hei-admin-ui/compare/1391f951dd303aabdad15ea35666766830c830de...v0.1.0) (2021-09-10)


### Features

* yarn create react-app ([1391f95](https://github.com/hei-school/hei-admin-ui/commit/1391f951dd303aabdad15ea35666766830c830de))



