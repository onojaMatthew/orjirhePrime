import React, { Component } from 'react';
import NewPollForm from '../../../contents/NewPollForm';
import { isAuthenticated } from '../../../../helpers/authenticate';

class NewPoll extends Component {
  state = {
    name: "",
    photo: "",
    uploadMessage: "Please wait. We are uploading your photo"
  }

  async componentDidMount() {
    const { getPoll } = this.props;
    try {
      await getPoll();
    }catch(err) {}
  }
  onSubmit = async ( e ) => {
    e.preventDefault();
    const { createPoll, polls: {polls} } = this.props;
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const { name } = this.state;
    
    const pollId = polls && polls[0] ? polls[ 0 ]._id : null;
    
    const data = { name };
    try {
      await createPoll( data, userId, pollId, token);
    } catch(err) {}
  }
  
  handleChange = ( field, e ) => {
    this.setState( { uploadMessage: "" } );
    let fields = this.state;
    fields[field] = e.target.value;
    this.setState( { fields } );
  }

  onFileChange = ( e ) => {
    let file = e.target.files[ 0 ];
    this.setState( { photo: file }, () => {
      this.handleFileUpload();
    })
  }

  handleFileUpload = async () => {
    // e.preventDefault();
    const { uploadPoll, getPoll } = this.props;
    let formData = new FormData();
    formData.append( "photo", this.state.photo )
    try {
      await uploadPoll( formData );
      await getPoll();
    }catch(err) {}
  }

  render() {
    const { name, photo, uploadMessage } = this.state;
    const { polls } = this.props;
    console.log(polls, " from new poll")
    return (
      <div>
        <NewPollForm
          onSubmit={this.onSubmit}
          handleChange={this.handleChange}
          name={name}
          polls={polls}
          photo={photo}
          uploadMessage={uploadMessage}
          onFileChange={this.onFileChange}
        />
      </div>
    );
  }
}

export default NewPoll;