import React,{useState,useEffect} from "react";
import {StyleSheet,View,FlatList,Modal,TouchableOpacity} from 'react-native' 
import AppButton from "./AppButton";
import AppContainer from './AppContainer'
import AppInput from './AppInput'
import AppText from "./AppText";
import AppCard from "./AppCard";
import AppTextBold from './AppTextBold'
import AsyncStorage from "@react-native-community/async-storage";
import { memberTemplate } from "../utils/utils";



const AddMemberModal = (props) =>{
    
    const [members,setMembers] = useState([memberTemplate]);

    const onAddRow = () =>{
        let membersArr = members;
        membersArr.push({...memberTemplate});
        setMembers([...membersArr])
    }

    const onRemoveRow = ()=>{
        let membersArr = members;
        membersArr.pop();
        setMembers([...membersArr])
    }

    const onNameChange = (e,index) =>{
        console.log(index)
        let membersArr = members;
        
        membersArr[index].ENG_F_NAME = e;        
        setMembers([...membersArr])
    }

    const onAgeChange = (e,index) =>{
        let membersArr = members;
        membersArr[index].AGE = e;
        
        setMembers([...membersArr])
    }

    const onMobileChange = (e,index)=>{
        let membersArr = members;
        membersArr[index].CONTACTNO = e;
        
        setMembers([...membersArr])
    }

    const onAddmember = ()=>{
        
    }

    return(
        <View style={{width:'100%',flex:1,padding:10}}>
          <View style = {{width:'100%',padding:15,elevation:5,backgroundColor:'white',marginTop:175,marginRight:10,borderRadius:10}}>
            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                 <AppTextBold style={{fontSize:16}}>Add Members</AppTextBold>
             </View>

             <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-end',marginBottom:10}}>
                <AppButton 
                    iconColor='white' 
                    iconSize={24} 
                    text="-" 
                    textStyle={{fontSize:18}}
                    onPressButton={()=>onRemoveRow()}
                    buttonStyle={{marginTop:15,backgroundColor:'#ff6961',width:35,height:35,marginRight:10}}/>
                
                <AppButton 
                    iconColor='white' 
                    iconSize={24} 
                    text="+" 
                    textStyle={{fontSize:18}}
                    onPressButton={()=>onAddRow()}
                    buttonStyle={{marginTop:15,backgroundColor:'#16d39a',width:35,height:35}}  />
             </View>


            {members.map((member,index)=>{
                return(
                    <View id={index} style={{width:'100%',flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
                        <View style={{width:'30%'}}>
                            <AppText>Name</AppText>
                            <AppInput 
                                hasIcon={false}
                                style={null}
                                placeholderText="Name"
                                isNumeric={false}
                                onTextChange={(e)=>onNameChange(e,index)}
                                value={member.ENG_F_NAME}/>
                        </View>
                        <View style={{width:'30%'}}>
                            <AppText>Age</AppText>
                            <AppInput 
                                hasIcon={false}
                                style={null}
                                placeholderText="Age"
                                isNumeric={false}
                                onTextChange={(e)=>onAgeChange(e,index)}
                                value={member.AGE}/>
                        </View>
                        <View style={{width:'30%'}}>
                            <AppText>Mobile</AppText>
                            <AppInput 
                                hasIcon={false}
                                style={null}
                                placeholderText="Mobile"
                                isNumeric={false}
                                onTextChange={(e)=>onMobileChange(e,index)}
                                value={member.CONTACTNO}/>
                        </View>
                    </View>
                )
            })}
            

            <AppButton 
                iconColor='white' 
                iconSize={24} 
                text="Add Members" 
                textStyle={{fontSize:18}}
                onPressButton={()=>onFilterApplyClick()}
                buttonStyle={{marginTop:15,backgroundColor:'#f49d34',width:'100%'}}  />

            <AppButton 
                iconColor='white' 
                iconSize={24} 
                text="Cancel" 
                textStyle={{fontSize:18,color:'#ff6961'}}
                onPressButton={()=> props.onCancel()}
                buttonStyle={{marginTop:15,borderWidth:1,borderColor:'#ff6961',backgroundColor:'white',width:'100%'}}  />

           </View>       
        </View>
    
    )

}

export default AddMemberModal;