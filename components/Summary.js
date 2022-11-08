import React,{useState} from 'react'
import { useFocusEffect } from '@react-navigation/native';
import {View,StyleSheet,TouchableOpacity} from 'react-native'
import AppTextBold from './AppTextBold';
import AppText from './AppText';
import PieChart from 'react-native-pie-chart';

const Summary = ({navigation,voterList}) => {
    const [maleVoters,setMaleVoters] = useState([]);
    const [femaleVoters,setFemaleVoters] = useState([]);
    const [otherVoters,setOtherVoters] = useState([]);
    const [showPieChart,setShowPieChart] = useState(false)
    const widthAndHeight = 100
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#1890ff','#ffc4bd','#7fc3ff']

    useFocusEffect(
        React.useCallback(() => {
        
            function setSummary(){
                let maleVoters = [];
                let femaleVoters = [];
                let otherVoters = [];

                console.log(89,voterList.length)
                voterList?.forEach((voter)=>{
                    switch(voter.SEX){
                        case "M":
                            maleVoters.push(voter)
                            break;
                        
                        case "F":
                            femaleVoters.push(voter)
                            break;
                        
                        default:
                            otherVoters.push(voter)
                            break;
                    }
                })
        
                console.log("maleVoters",maleVoters.length)
                console.log("femaleVoter",femaleVoters.length)
                console.log("otherVoters",otherVoters.length)
             
                setMaleVoters([...maleVoters])
                setFemaleVoters([...femaleVoters])
                setOtherVoters([...otherVoters])
                setShowPieChart(true)
            }

            setSummary();
        },[voterList])
    )
    return (
        <>
        <View style={styles.TableContainer}>
                <View style={styles.TableHeaderContainer}>
                    
                </View>
                <View style={styles.TableHeaderContainer}>
                    <AppTextBold>Male</AppTextBold>
                </View>
                <View style={styles.TableHeaderContainer}>
                    <AppTextBold>Female</AppTextBold>
                </View>
                <View style={styles.TableHeaderContainer}>
                    <AppTextBold>Others</AppTextBold>
                </View>
             </View>
             <View style={{...styles.TableContainer,...{marginTop:10}}}>
                <View style={styles.TableHeaderContainer}>
                    <AppTextBold>Voters</AppTextBold>
                </View>
                <View style={styles.TableHeaderContainer}>
                    <TouchableOpacity onPress={()=>navigation.navigate('SearchVoterScreen',{voters:JSON.stringify(maleVoters)})}>
                        <AppText>{maleVoters.length}</AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.TableHeaderContainer}>
                    <TouchableOpacity  onPress={()=>navigation.navigate('SearchVoterScreen',{voters:JSON.stringify(femaleVoters)})}>
                        <AppText>{femaleVoters.length}</AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.TableHeaderContainer}>
                    <TouchableOpacity onPress={()=>navigation.navigate('SearchVoterScreen',{voters:JSON.stringify(otherVoters)})}>
                        <AppText>{otherVoters.length}</AppText>
                    </TouchableOpacity>
                </View>
             </View>

            {maleVoters.length > 0 ? 
                    <View style={{marginTop:25,width:'100%',height:300,justifyContent:'center',alignItems:'center'}}>
                        <View style={{width:'100%',justifyContent:'flex-start',padding:10}}>
                            <AppText style={styles.title}>Pie Chart</AppText>
                        </View>
                        
                        <PieChart
                            widthAndHeight={200}
                            series={[maleVoters.length,femaleVoters.length,otherVoters.length]}
                            sliceColor={sliceColor}
                            doughnut={true}
                            coverRadius={0.45}
                            coverFill={'#FFF'}
                        />
                        <View style={{width:'100%',justifyContent:'center',marginTop:25,flexDirection:'row'}}>
                            <TouchableOpacity onPress={()=>navigation.navigate('SearchVoterScreen',{voters:JSON.stringify(maleVoters)})} style={{width:'30%',flexDirection:'row',justifyContent:'center'}}>
                                <View style={{width:35,height:35,backgroundColor:'#1890ff'}} />
                                <View style={{marginLeft:10}}>
                                    <AppText>Male</AppText>
                                    <AppTextBold>{parseFloat((maleVoters.length / (maleVoters.length+femaleVoters.length+otherVoters.length))*100).toFixed(2)} %</AppTextBold>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>navigation.navigate('SearchVoterScreen',{voters:JSON.stringify(femaleVoters)})} style={{width:'30%',flexDirection:'row'}}>
                                <View style={{width:35,height:35,backgroundColor:'#ffc4bd'}} />
                                <View style={{marginLeft:10}}>
                                    <AppText>Female</AppText>
                                    <AppTextBold>{parseFloat((femaleVoters.length / (maleVoters.length+femaleVoters.length+otherVoters.length))*100).toFixed(2)} %</AppTextBold>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>navigation.navigate('SearchVoterScreen',{voters:JSON.stringify(otherVoters)})} style={{width:'30%',flexDirection:'row'}}>
                                <View style={{width:35,height:35,backgroundColor:'#7fc3ff'}} />
                                <View style={{marginLeft:10}}>
                                    <AppText>Others</AppText>
                                    <AppTextBold>{parseFloat((otherVoters.length / (maleVoters.length+femaleVoters.length+otherVoters.length))*100).toFixed(2)} %</AppTextBold>
                                </View>
                            </TouchableOpacity>
                        </View>
                </View>
            :null}
             
        </>
        
    )
}

const styles = StyleSheet.create({
    AppContainer:{
        alignItems:'flex-start',
        padding:10
    },
    TableContainer:{
        width:'100%',
        height:15,
        marginTop:10,
        flexDirection:'row'
    },
    TableHeaderContainer:{
        width:'25%',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        height:25
    }
})

export default Summary