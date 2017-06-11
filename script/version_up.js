const fs = require("fs-extra");
const path = require("path");

const [packageJSONPath,messageForCommitPath] = (
    ["package.json","commitMessage.txt"]
    .map((file)=>(path.resolve(process.cwd(),file)))
);

const packageVersionUp = async (packageJSON) => {

    let {version,name} = packageJSON;

    let newVersion = (
        (version.split("."))
        .map((v,i,a)=>(
            (i !== a.length-1)
            ? v
            : String(Number(v)+1)
        ))
        .join(".")
    );

    console.log(`${name} will be update. ${version} => ${newVersion}`);
    packageJSON.version = newVersion;
    let packageJSONString = JSON.stringify(packageJSON,null,"  ");
    await fs.writeFile(messageForCommitPath,newVersion);
    return fs.writeFile(packageJSONPath,packageJSONString);

}

packageVersionUp(require(packageJSONPath));
