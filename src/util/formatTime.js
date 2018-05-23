const formatTime = (time) => {
    var minute = Math.floor(time / 60)
    var second = time - minute*60
    if (second !== 0){
        second = second+"초"
    }else{
        second = ""
    }
    return minute + "분 " + second
}

export default formatTime;