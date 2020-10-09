const path = require('path');
const fs = require('fs');
const util = require('util');
const jenkinsapi = require('jenkins-api');
const base = path.join('/', 'data', 'platform');
const platforms = ['nextseq', 'novaseq'];

const readdir = util.promisify(fs.readdir);

module.exports = {
    run: async function main() {

        console.log('main is running..');
        for (platform of platforms) {

            const runs = await getFiles(getBaseDirectory(platform));
            for (const run of runs) {
                const runFullPath = path.join(base, platform, run);
                if (hasStatsDir(runFullPath)) {
                    console.log(`\t\t -> ${runFullPath} has statsDir`);
                    createCNVDirectory(runFullPath);
                    const statsFiles = await getFiles(getStatsDir(runFullPath));
                    for (const statsFile of statsFiles) {
                        if (!hasVCF(runFullPath, statsFile)) {
                            console.log(`O vcf não existe ${runFullPath} - ${statsFile}`)
                            callJenkins(runFullPath, statsFile);
                        }

                    }
                }
            }
        }
    }
}


function callJenkins(run, statsFile) {
    console.log(`checando o jenkins to run ${run} and statsFile ${statsFile}`);
    const bam = path.join(getAnalysisDir(run), "bam", statsFile.replace(/_tags.tsv$/, ".bam"));
    console.log(`Bam no jenkins ${bam}`)
    if(fs.existsSync(bam)){
        console.log(`*** Call jenkins to ${bam} ***`);
    }
    //const fullPath = path.join(getAnalysisDir(run), "cnv", vcfFileName);
    //console.log(`chamar o jenkins para o caminho ${fullPath}` );
    //    var jenkins = jenkinsapi.init('http://marcelo:11c764e338e0a006d415dadb1b8cd34ece@localhost:8080');
    //
    //    jenkins.build_with_params('tst3', {run: 'OlhaOTeste'},function(err, data) {
    //        if (err){ return console.log(`Ops: Error \n ${err}`); }
    //        console.log(`It's ok ${data}`);
    //      });

}


function callJenkinsDisabled(run, statsFile) {
    console.log(`chamando o jenkins`);
    //    var jenkins = jenkinsapi.init('http://marcelo:11c764e338e0a006d415dadb1b8cd34ece@localhost:8080');
    //
    //    jenkins.build('tst1', function(err, data) {
    //        if (err){ return console.log(`Ops: Error \n ${err}`); }
    //        console.log(`It's ok ${data}`);
    //      });
    //
    //curl -X POST http://localhost:8080/job/tst1/build --user marcelo:11c764e338e0a006d415dadb1b8cd34ece; 
}

function getBamPath(run, statsFile){
    return path.join(getAnalysisDir(run), "bam", getBamName(statsFile));
}

function getBamName(statsFile) {
    return statsfile.replace(/_tags.tsv$/, ".bam");
}

function getVcfName(statsFile) {
    return statsFile.replace(/_tags.tsv$/, ".cnv.vcf");
}

function hasVCF(run, statsFile) {
    const vcfFileName = getVcfName(statsFile);
    vcfFullPath = path.join(getAnalysisDir(run), "cnv", vcfFileName);
    return fs.existsSync(vcfFullPath);

}

function getCNVDirectory(run) {
    return path.join(getAnalysisDir(run), "cnv");
}

function createCNVDirectory(run) {
    if (!fs.existsSync(getCNVDirectory(run))) {
        fs.mkdirSync(getCNVDirectory(run));
    }
}

function getStatsDir(run) {
    return path.join(getAnalysisDir(run), "stats");
}

function getAnalysisDir(run) {
    return path.join(run, "analysis");
}

function getBaseDirectory(platform){
    return path.join(base, platform);
}

function hasAnalysisDir(run) {
    //console.log(getAnalysisDir(run));
    return fs.existsSync(getAnalysisDir(run));
}

function hasStatsDir(run) {
    if (hasAnalysisDir(run)) {
        return fs.existsSync(getStatsDir(run));
        //return true;
    }
    return false;
}

async function getFiles(path) {
    let runs;
    try {
        runs = await readdir(path);        
    } catch (err) {
        console.log(err);
    }
    return runs;
}