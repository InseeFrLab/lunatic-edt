/*
 * Author: Kasun Gajasinghe, University of Moratuwa
 * E-Mail: kasunbg AT gmail DOT com
 * Date: 09.08.2010
 *
 * usage: stemmer(word);
 * ex: var stem = stemmer("foobar");
 * Implementation of the stemming algorithm at http://snowball.tartarus.org/algorithms/french/stemmer.html
 *
 * LICENSE:
 *
 * Copyright (c) 2010, Kasun Gajasinghe. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 *
 *
 * THIS SOFTWARE IS PROVIDED BY KASUN GAJASINGHE ''AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL KASUN GAJASINGHE BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
 * USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

export const stemmer = (word: string) => {
    //    Letters in French include the following accented forms,
    //        Ã¢   Ã    Ã§   Ã«   Ã©   Ãª   Ã¨   Ã¯   Ã®   Ã´   Ã»   Ã¹
    //    The following letters are vowels:
    //        a   e   i   o   u   y   Ã¢   Ã    Ã«   Ã©   Ãª   Ã¨   Ã¯   Ã®   Ã´   Ã»   Ã¹

    word = word.toLowerCase();
    let oriWord = word;
    word = word.replace(/qu/g, "qU"); //have to perform first, as after the operation, capital U is not treated as a vowel
    word = word.replace(/([aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹])u([aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹])/g, "$1U$2");
    word = word.replace(/([aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹])i([aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹])/g, "$1I$2");
    word = word.replace(/([aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹])y/g, "$1Y");
    word = word.replace(/y([aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹])/g, "Y$1");

    let rvIndex = -1;
    if (word.search(/^(par|col|tap)/) != -1 || word.search(/^[aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹]{2}/) != -1) {
        rvIndex = 3;
    } else {
        rvIndex = word.substring(1).search(/[aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹]/);
        if (rvIndex != -1) {
            rvIndex += 2; //+2 is to supplement the substring(1) used to find rvIndex
        } else {
            rvIndex = word.length;
        }
    }

    //    R1 is the region after the first non-vowel following a vowel, or the end of the word if there is no such non-vowel.
    //    R2 is the region after the first non-vowel following a vowel in R1, or the end of the word if there is no such non-vowel
    let r1Index = word.search(/[aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹][^aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹]/);
    let r1 = "";
    if (r1Index != -1) {
        r1Index += 2;
        r1 = word.substring(r1Index);
    } else {
        r1Index = word.length;
    }

    let r2Index = -1;
    if (r1Index != -1) {
        r2Index = r1.search(/[aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹][^aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹]/);
        if (r2Index != -1) {
            r2Index += 2;
            r2Index += r1Index;
        } else {
            r2Index = word.length;
        }
    }
    if (r1Index != -1 && r1Index < 3) {
        r1Index = 3;
        r1 = word.substring(r1Index);
    }

    /*
    Step 1: Standard suffix removal
    */
    let a1Index = word.search(/(ance|iqUe|isme|able|iste|eux|ances|iqUes|ismes|ables|istes)$/);
    let a2Index = word.search(/(atrice|ateur|ation|atrices|ateurs|ations)$/);
    let a3Index = word.search(/(logie|logies)$/);
    let a4Index = word.search(/(usion|ution|usions|utions)$/);
    let a5Index = word.search(/(ence|ences)$/);
    let a6Index = word.search(/(ement|ements)$/);
    let a7Index = word.search(/(itÃ©|itÃ©s)$/);
    let a8Index = word.search(/(if|ive|ifs|ives)$/);
    let a9Index = word.search(/(eaux)$/);
    let a10Index = word.search(/(aux)$/);
    let a11Index = word.search(/(euse|euses)$/);
    let a12Index = word.search(/[^aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹](issement|issements)$/);
    let a13Index = word.search(/(amment)$/);
    let a14Index = word.search(/(emment)$/);
    let a15Index = word.search(/[aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹](ment|ments)$/);

    if (a1Index != -1 && a1Index >= r2Index) {
        word = word.substring(0, a1Index);
    } else if (a2Index != -1 && a2Index >= r2Index) {
        word = word.substring(0, a2Index);
        let a2Index2 = word.search(/(ic)$/);
        if (a2Index2 != -1 && a2Index2 >= r2Index) {
            word = word.substring(0, a2Index2); //if preceded by ic, delete if in R2,
        } else {
            //else replace by iqU
            word = word.replace(/(ic)$/, "iqU");
        }
    } else if (a3Index != -1 && a3Index >= r2Index) {
        word = word.replace(/(logie|logies)$/, "log"); //replace with log if in R2
    } else if (a4Index != -1 && a4Index >= r2Index) {
        word = word.replace(/(usion|ution|usions|utions)$/, "u"); //replace with u if in R2
    } else if (a5Index != -1 && a5Index >= r2Index) {
        word = word.replace(/(ence|ences)$/, "ent"); //replace with ent if in R2
    } else if (a6Index != -1 && a6Index >= rvIndex) {
        word = word.substring(0, a6Index);
        if (word.search(/(iv)$/) >= r2Index) {
            word = word.replace(/(iv)$/, "");
            if (word.search(/(at)$/) >= r2Index) {
                word = word.replace(/(at)$/, "");
            }
        } else if (word.search(/(eus)$/) != -1) {
            let a6Index2 = word.search(/(eus)$/);
            if (a6Index2 >= r2Index) {
                word = word.substring(0, a6Index2);
            } else if (a6Index2 >= r1Index) {
                word = word.substring(0, a6Index2) + "eux";
            }
        } else if (word.search(/(abl|iqU)$/) >= r2Index) {
            word = word.replace(/(abl|iqU)$/, ""); //if preceded by abl or iqU, delete if in R2,
        } else if (word.search(/(iÃ¨r|IÃ¨r)$/) >= rvIndex) {
            word = word.replace(/(iÃ¨r|IÃ¨r)$/, "i"); //if preceded by abl or iqU, delete if in R2,
        }
    } else if (a7Index != -1 && a7Index >= r2Index) {
        word = word.substring(0, a7Index); //delete if in R2
        if (word.search(/(abil)$/) != -1) {
            //if preceded by abil, delete if in R2, else replace by abl, otherwise,
            let a7Index2 = word.search(/(abil)$/);
            if (a7Index2 >= r2Index) {
                word = word.substring(0, a7Index2);
            } else {
                word = word.substring(0, a7Index2) + "abl";
            }
        } else if (word.search(/(ic)$/) != -1) {
            let a7Index3 = word.search(/(ic)$/);
            if (a7Index3 != -1 && a7Index3 >= r2Index) {
                word = word.substring(0, a7Index3); //if preceded by ic, delete if in R2,
            } else {
                //else replace by iqU
                word = word.replace(/(ic)$/, "iqU");
            }
        } else if (word.search(/(iv)$/) != r2Index) {
            word = word.replace(/(iv)$/, "");
        }
    } else if (a8Index != -1 && a8Index >= r2Index) {
        word = word.substring(0, a8Index);
        if (word.search(/(at)$/) >= r2Index) {
            word = word.replace(/(at)$/, "");
            if (word.search(/(ic)$/) >= r2Index) {
                word = word.replace(/(ic)$/, "");
            } else {
                word = word.replace(/(ic)$/, "iqU");
            }
        }
    } else if (a9Index != -1) {
        word = word.replace(/(eaux)/, "eau");
    } else if (a10Index >= r1Index) {
        word = word.replace(/(aux)/, "al");
    } else if (a11Index != -1) {
        let a11Index2 = word.search(/(euse|euses)$/);
        if (a11Index2 >= r2Index) {
            word = word.substring(0, a11Index2);
        } else if (a11Index2 >= r1Index) {
            word = word.substring(0, a11Index2) + "eux";
        }
    } else if (a12Index != -1 && a12Index >= r1Index) {
        word = word.substring(0, a12Index + 1); //+1- amendment to non-vowel
    } else if (a13Index != -1 && a13Index >= rvIndex) {
        word = word.replace(/(amment)$/, "ant");
    } else if (a14Index != -1 && a14Index >= rvIndex) {
        word = word.replace(/(emment)$/, "ent");
    } else if (a15Index != -1 && a15Index >= rvIndex) {
        word = word.substring(0, a15Index + 1);
    }

    /* Step 2a: Verb suffixes beginning i*/
    let wordStep1 = word;
    let step2aDone = false;
    if (oriWord == word.toLowerCase() || oriWord.search(/(amment|emment|ment|ments)$/) != -1) {
        step2aDone = true;
        let b1Regex =
            /([^aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹])(Ã®mes|Ã®t|Ã®tes|i|ie|ies|ir|ira|irai|iraIent|irais|irait|iras|irent|irez|iriez|irions|irons|iront|is|issaIent|issais|issait|issant|issante|issantes|issants|isse|issent|isses|issez|issiez|issions|issons|it)$/i;
        if (word.search(b1Regex) >= rvIndex) {
            word = word.replace(b1Regex, "$1");
        }
    }

    /* Step 2b:  Other verb suffixes*/
    if (step2aDone && wordStep1 == word) {
        if (word.search(/(ions)$/) >= r2Index) {
            word = word.replace(/(ions)$/, "");
        } else {
            let b2Regex =
                /(Ã©|Ã©e|Ã©es|Ã©s|Ã¨rent|er|era|erai|eraIent|erais|erait|eras|erez|eriez|erions|erons|eront|ez|iez)$/i;
            if (word.search(b2Regex) >= rvIndex) {
                word = word.replace(b2Regex, "");
            } else {
                let b3Regex =
                    /e(Ã¢mes|Ã¢t|Ã¢tes|a|ai|aIent|ais|ait|ant|ante|antes|ants|as|asse|assent|asses|assiez|assions)$/i;
                if (word.search(b3Regex) >= rvIndex) {
                    word = word.replace(b3Regex, "");
                } else {
                    let b3Regex2 =
                        /(Ã¢mes|Ã¢t|Ã¢tes|a|ai|aIent|ais|ait|ant|ante|antes|ants|as|asse|assent|asses|assiez|assions)$/i;
                    if (word.search(b3Regex2) >= rvIndex) {
                        word = word.replace(b3Regex2, "");
                    }
                }
            }
        }
    }

    if (oriWord != word.toLowerCase()) {
        /* Step 3 */
        if (word.search(/Y$/) != -1) {
            word = word.replace(/Y$/, "i");
        } else if (word.search(/Ã§$/) != -1) {
            word = word.replace(/Ã§$/, "c");
        }
    } else {
        /* Step 4 */
        //If the word ends s, not preceded by a, i, o, u, Ã¨ or s, delete it.
        if (word.search(/([^aiouÃ¨s])s$/) >= rvIndex) {
            word = word.replace(/([^aiouÃ¨s])s$/, "$1");
        }
        let e1Index = word.search(/ion$/);
        if (e1Index >= r2Index && word.search(/[st]ion$/) >= rvIndex) {
            word = word.substring(0, e1Index);
        } else {
            let e2Index = word.search(/(ier|iÃ¨re|Ier|IÃ¨re)$/);
            if (e2Index != -1 && e2Index >= rvIndex) {
                word = word.substring(0, e2Index) + "i";
            } else {
                if (word.search(/e$/) >= rvIndex) {
                    word = word.replace(/e$/, ""); //delete last e
                } else if (word.search(/guÃ«$/) >= rvIndex) {
                    word = word.replace(/guÃ«$/, "gu");
                }
            }
        }
    }

    /* Step 5: Undouble */
    //word = word.replace(/(en|on|et|el|eil)(n|t|l)$/,'$1');
    word = word.replace(/(en|on)(n)$/, "$1");
    word = word.replace(/(ett)$/, "et");
    word = word.replace(/(el|eil)(l)$/, "$1");

    /* Step 6: Un-accent */
    word = word.replace(/[Ã©Ã¨]([^aeiouyÃ¢Ã Ã«Ã©ÃªÃ¨Ã¯Ã®Ã´Ã»Ã¹]+)$/, "e$1");
    word = word.toLowerCase();
    return word;
};
