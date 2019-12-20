import React from 'react';
import ImageUploader from 'react-images-upload';
import * as bitcoin from "./modules/bitcoin";
import {signMessage} from "./modules/sign";
 
class App extends React.Component {
 
    constructor(props) {
        super(props);
        this.state = { pictures: [], previewimage: null, 
          slpaddress: {
            fetchingaddress: false, slpaddress: null, fetchedaddress: false
          },
          signature: "",
          slptokenid: null,
          sampledata: {
            privatekey:"L23PpjkBQqpAF4vbMHNfTZAb3KFPBSawQ7KinFTzz7dxq6TZX8UA",
            address: "13Js7D3q4KvfSqgKN8LpNq57gcahrVc5JZ" 
          }
        };

        this.onDrop = this.onDrop.bind(this);
        this.onInputTokenID = this.onInputTokenID.bind(this);
        this.onGetSLPAddress = this.onGetSLPAddress.bind(this);
        this.onInputSignature = this.onInputSignature.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }
 
    onDrop(picture) {
      console.log(picture[0]);
      this.setState({
          pictures: this.state.pictures.concat(picture),
      });

      var fr = new FileReader;

      fr.onload = function()
      {
        this.setState({ previewimage:fr.result });
        this.setState({ sampledata: { ...this.state.sampledata, signature: signMessage(fr.result, this.state.sampledata.privatekey)}});
      }.bind(this);

      fr.readAsDataURL(picture[0]);
    }

    onInputTokenID(e)
    {
      if(!this.state.slpaddress.fetchingaddress)
      {
        bitcoin.getSLPAddressFromTokenID(e.target.value, this.onGetSLPAddress);
        this.setState(
          {
            slpaddress: { ...this.state.slpaddress, fetchedaddress: false, fetchingaddress: true},
            slptokenid: e.target.value
          });
      }
      
    }

    onInputSignature(e)
    {
      this.setState({signature: e.target.value});
    }

    onGetSLPAddress(address)
    {
      this.setState({slpaddress: { ...this.state.slpaddress, fetchedaddress: true, fetchingaddress: false, slpaddress: address, legacy: bitcoin.getLegacyFromSLPAddress(address)}});
    }
    
    onClickSubmit(e)
    {
      /*
      console.log("submit data", this.state);
      const formData = new FormData();
      formData.append('file', this.state.pictures[0]);
      formData.append('signature', this.state.signature);
      formData.append('address', this.state.slpaddress.legacy);
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      
      fetch('http://localhost:3001/upload', {
        method: "POST", 
        headers: {
          'content-type': 'multipart/form-data'
        },
        body: formData
      })
      .then((response) => {
        console.log("successed", response);
      })
      .catch((error) => {
        console.log("failed", error);
      });
      

      
     fetch('/users')
     .then(res => res.json())
     .then(users => {console.log(users)});
     */
    }
 
    render() {

      return (
        <form action="http://localhost:3001/upload" method="post" encType="multipart/form-data">
          <ImageUploader
              withIcon={true}
              buttonText='Choose images'
              onChange={this.onDrop}
              imgExtension={['.jpg', '.gif', '.png', '.gif']}
              maxFileSize={5242880}
              key="imageuploader"
              name="file"
          /> 

          {this.state.previewimage && <img src={this.state.previewimage} key="image" />}
          {this.state.previewimage && <div style={{wordWrap:'break-word', height: "200px", overflow: "scroll", width: '100%'}}  key="textarea"> {this.state.previewimage} </div>}
          <div>
            <label> Token id: </label><input name="tokenid" onBlur={this.onInputTokenID} ></input> 
            <label> Signature: </label><input name="signature" onChange={this.onInputSignature} value={this.state.signature}></input> 
            <div>{this.state.slpaddress.fetchingaddress && <label> Looking up address</label>} </div>
            <div>
              {<label> Address: </label>}
              { <input name="legacy" value={this.state.slpaddress.legacy}></input>}
            </div>
            <button type="submit" onClick={this.onClickSubmit}>Submit</button>
          </div>
          Address: <textarea value={this.state.sampledata.address}></textarea>
          Private Key: <textarea value={this.state.sampledata.privatekey}></textarea>
          Signature: <textarea value={this.state.sampledata.signature}></textarea>
        </form>
      );
    }
}

export default App;