 class UserDTO{
    constructor (user){
        this.first_name=user.first_name ,
        this.last_name=user.last_name,
        this.email=user.email,
        this.role=user.role
        this._id=user._id
        
    }
}
module.exports={UserDTO};