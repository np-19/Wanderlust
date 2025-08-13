module.exports = (fun) => {
    return function (req,res,next) {
            fun(req,res).catch((err) => next(err));
    }
}