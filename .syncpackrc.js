// @ts-check

/** @type {import("syncpack").RcFile} */
export default {
    "lintFormatting": false,
    "dependencyTypes": ["prod", "dev"],
    "semverGroups": [
        {
            "packages": ["@workleap/**"],
            "dependencyTypes": ["prod", "peer"],
            "range": "^",
            "label": "Packages should use ^ for dependencies and peerDependencies."
        },
        {
            "packages": ["**"],
            "dependencyTypes": ["prod", "dev"],
            "range": "",
            "label": "Packages should pin devDependencies."
        },
    ],
    "versionGroups": [
        {
            "packages": ["**"],
            "dependencyTypes": ["prod", "peer", "dev"],
            "preferVersion": "highestSemver",
            "label": "Packages should have a single version across the repository."
        }
    ]
};
