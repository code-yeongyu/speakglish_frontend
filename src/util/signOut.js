const signOut = (props) => {
    props.logout()
    props.history.push('/');
}
export default signOut;