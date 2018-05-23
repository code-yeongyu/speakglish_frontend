const pageRedirection = (props, onlyLogin=false) => {
    if(onlyLogin){
        if(props.store.login.status !== "SUCCESS") {
            props.history.push('/');
            return true
        }
    }else{
        if(props.store.login.status === "SUCCESS") {
            props.history.push("/articles");
            return true;
        }
    }
    return false;
}

export default pageRedirection;