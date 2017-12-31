import  {request}           from '../../utils/RequestUtil';
import *as appUrls from '../../constant/appUrls';

let DeployData = {};

export const getCarDeployData =(showLoadAction,showToastAction,fetchDeployDataAction)=>{

    if(Object.keys(DeployData).length ){

        showLoadAction &&  showLoadAction(false);
        fetchDeployDataAction(DeployData);

    }else {
        showLoadAction && showLoadAction(true);
        request(appUrls.CAR_CONFIG,'post',{}).then((response) => {
            DeployData = response.mjson.data;
            fetchDeployDataAction(response.mjson.data);
            showLoadAction &&  showLoadAction(false);
        }, (error) => {
            showLoadAction && showLoadAction(false);
            showToastAction &&  showToastAction(error.msg);
        });
    }
}