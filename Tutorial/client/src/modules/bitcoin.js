
import {bitcore, Utils} from "slpjs"

const axios = require("axios");
const bota = require("btoa");

export function signMessage(message, func)
{
    var Message = require('bitcore-message');
    var bitcore1 = require("bitcore-lib");

    var privateKey = new bitcore1.PrivateKey('L23PpjkBQqpAF4vbMHNfTZAb3KFPBSawQ7KinFTzz7dxq6TZX8UA');
    var message = new Message('This is an example of a signed message.');

    var signature = message.sign(privateKey);
}

export function verifyMessage(message, signature, address)
{
 
    //var Message = bitcore.Message;
    var Message = require('bitcore-message');
    console.log(Message);

    var verified = Message('This is an example of a signed message.').verify(address, signature);
    return verified;
}

export function getCashAddressFromSLPAddress(address)
{
    let cashaddr = Utils.toCashAddress(address);

    return cashaddr;
}

export function getLegacyFromSLPAddress(address)
{
    let legacy = Utils.toLegacyAddress(address);
    return legacy;
}


export function getSLPAddressFromTokenID(tokenid, callback)
{
    const query = {
        "v": 3,
        "q": {
            "db": ["g"],
            "find": {
                "tokenDetails.tokenIdHex": tokenid
            }
        }
    };
    axios.get(getSLPDBUrlFromQuery(query))
            .then(function(response){
                const BreakException = {};
                try{
                    response.data.g.forEach(element => {
                    
                        const graphTxn = element.graphTxn;
                        if(graphTxn.txid == tokenid)
                        {
                            const inputs = graphTxn.inputs;
                            const outputs = graphTxn.outputs;
                            if(outputs.length != 0)
                                callback(outputs[0].address);
                            else if(inputs.length != 0)
                                callback(inputs[0].address);   
                            throw BreakException;        
                        }
                    });

                    callback(null);
                }catch(e)
                {
                    if(e !== BreakException) throw e;
                    else return;
                }
                
            })
            .catch(function(error){
                console.log("getSLPAddress failed", error);
                callback(null);
            })
            .finally(function(){

            });
}


export function getSLPDBUrlFromQuery(query)
{
  var query_sz = JSON.stringify(query);

  var v64 = btoa(query_sz);
  return "https://slpdb.bitcoin.com/q/" + v64;
}