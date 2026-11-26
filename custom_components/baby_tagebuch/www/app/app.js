/* Baby-Tagebuch 1.2.0 – Offline-App */

"use strict";
/* ===== Referenzdaten =====
   Kromeyer-Hauschild (2001), LMS-Parameter Gewicht/Länge 0–3 J.; negative Alter = Voigt-Werte
   für 23–39 vollendete SSW (Frühgeborenenkorrektur), Quelle: R-Paket childsds (kro.ref).
   Kopfumfang: WHO Child Growth Standards (KH enthält keinen Kopfumfang), Quelle: childsds (who.ref).
   Zeilen: [Alter in Jahren, nu(L), mu(M), sigma(S)] – Verteilung BCCG */
const REF = {"kro_weight_male":[[-0.326,1.36,0.6,0.158],[-0.307,1.0,0.69,0.169],[-0.287,1.74,0.8,0.161],[-0.268,2.15,0.94,0.163],[-0.249,2.47,1.08,0.161],[-0.23,2.47,1.22,0.164],[-0.211,2.19,1.35,0.182],[-0.192,2.27,1.52,0.173],[-0.172,1.28,1.69,0.21],[-0.153,1.95,1.89,0.18],[-0.134,1.74,2.13,0.185],[-0.115,1.66,2.39,0.176],[-0.096,1.05,2.64,0.17],[-0.077,1.0,2.86,0.147],[-0.057,1.0,3.09,0.136],[-0.038,0.98,3.3,0.128],[-0.019,1.0,3.47,0.121],[0.0,1.2044,3.3953,0.14749],[0.083,1.11449,4.2685,0.14522],[0.167,1.02562,5.1342,0.143],[0.25,0.93915,5.9556,0.14088],[0.333,0.85666,6.6841,0.13891],[0.417,0.77959,7.305,0.13714],[0.5,0.70639,7.8635,0.13552],[0.583,0.63915,8.3421,0.13414],[0.667,0.57713,8.7663,0.13295],[0.75,0.52119,9.1398,0.13199],[0.833,0.46761,9.4966,0.1311],[0.917,0.41957,9.8174,0.1304],[1.0,0.37556,10.1154,0.12982],[1.083,0.33531,10.3927,0.12935],[1.167,0.30634,10.6028,0.12914],[1.25,0.27737,10.8129,0.12893],[1.333,0.2484,11.023,0.12871],[1.417,0.21944,11.233,0.1285],[1.5,0.19047,11.4431,0.12829],[1.583,0.1615,11.6532,0.12807],[1.667,0.13259,11.8629,0.12786],[1.75,0.11147,12.0236,0.1278],[1.833,0.09143,12.1776,0.12775],[1.917,0.0722,12.3267,0.12773],[2.0,0.05346,12.4733,0.12772],[2.083,0.03494,12.6197,0.12772],[2.167,0.01647,12.7671,0.12774],[2.25,-0.00207,12.9168,0.12778],[2.333,-0.02084,13.0702,0.12783],[2.417,-0.03982,13.2265,0.1279],[2.5,-0.059,13.3858,0.12798],[2.583,-0.07904,13.5563,0.12811],[2.667,-0.09908,13.7269,0.12823],[2.75,-0.11913,13.8975,0.12836],[2.833,-0.13932,14.0701,0.12849],[2.917,-0.16013,14.2511,0.12867],[3.0,-0.18113,14.4346,0.12886]],"kro_weight_female":[[-0.326,1.35,0.58,0.163],[-0.307,1.59,0.67,0.163],[-0.287,1.0,0.76,0.182],[-0.268,1.64,0.88,0.179],[-0.249,1.65,1.0,0.187],[-0.23,1.52,1.12,0.197],[-0.211,1.49,1.25,0.202],[-0.192,1.53,1.42,0.203],[-0.172,1.49,1.59,0.22],[-0.153,1.74,1.79,0.189],[-0.134,1.65,2.03,0.191],[-0.115,1.42,2.27,0.184],[-0.096,1.0,2.55,0.174],[-0.077,1.12,2.76,0.157],[-0.057,1.0,2.97,0.143],[-0.038,0.89,3.16,0.13],[-0.019,0.97,3.32,0.124],[0.0,1.12942,3.3078,0.13848],[0.083,1.0403,4.0406,0.1373],[0.167,0.95231,4.758,0.13614],[0.25,0.86608,5.4487,0.13499],[0.333,0.78293,6.0855,0.13387],[0.417,0.70349,6.6647,0.13282],[0.5,0.62828,7.1863,0.13187],[0.583,0.55772,7.6507,0.13105],[0.667,0.49462,8.0432,0.13044],[0.75,0.43152,8.4357,0.12983],[0.833,0.37392,8.7871,0.12937],[0.917,0.3215,9.1056,0.12905],[1.0,0.27313,9.4022,0.12882],[1.083,0.23024,9.6718,0.1287],[1.167,0.19542,9.902,0.12872],[1.25,0.16061,10.1321,0.12874],[1.333,0.12579,10.3623,0.12875],[1.417,0.09098,10.5925,0.12877],[1.5,0.05616,10.8227,0.12879],[1.583,0.02138,11.0527,0.12881],[1.667,-0.00541,11.2439,0.12894],[1.75,-0.03154,11.4322,0.12907],[1.833,-0.0562,11.6143,0.12923],[1.917,-0.08001,11.7935,0.1294],[2.0,-0.10318,11.9715,0.12959],[2.083,-0.12583,12.1491,0.12979],[2.167,-0.14804,12.3268,0.13001],[2.25,-0.16984,12.5048,0.13024],[2.333,-0.191,12.6842,0.13049],[2.417,-0.21215,12.8636,0.13075],[2.5,-0.23331,13.043,0.131],[2.583,-0.25392,13.2246,0.13129],[2.667,-0.27407,13.4084,0.13159],[2.75,-0.29421,13.5921,0.13189],[2.833,-0.31432,13.7759,0.1322],[2.917,-0.33396,13.9611,0.13253],[3.0,-0.35335,14.1469,0.13287]],"kro_height_male":[[-0.326,1.0,31.0,0.07],[-0.307,1.0,32.2,0.073],[-0.287,1.0,33.5,0.076],[-0.268,1.45,34.71,0.074],[-0.249,1.28,36.22,0.079],[-0.23,1.63,37.6,0.078],[-0.211,1.96,38.85,0.074],[-0.192,2.1,40.41,0.07],[-0.172,2.21,41.87,0.069],[-0.153,1.09,43.48,0.073],[-0.134,1.0,45.1,0.071],[-0.115,1.66,46.1,0.063],[-0.096,1.1,47.61,0.054],[-0.077,1.01,49.06,0.05],[-0.057,2.19,50.07,0.046],[-0.038,1.0,51.0,0.045],[-0.019,1.0,51.8,0.042],[0.0,1.0,51.5354,0.04659],[0.083,1.0,54.5602,0.04603],[0.167,1.0,57.608,0.04544],[0.25,1.0,60.5867,0.04481],[0.333,1.0,63.3179,0.04413],[0.417,1.0,65.7118,0.04343],[0.5,1.0,67.8819,0.04275],[0.583,1.0,69.7365,0.04212],[0.667,1.0,71.3754,0.04155],[0.75,1.0,72.8268,0.04107],[0.833,1.0,74.2219,0.04063],[0.917,1.0,75.5019,0.04028],[1.0,1.0,76.7215,0.04],[1.083,1.0,77.8947,0.03978],[1.167,1.0,78.8948,0.0397],[1.25,1.0,79.895,0.03963],[1.333,1.0,80.8951,0.03956],[1.417,1.0,81.8952,0.03949],[1.5,1.0,82.8953,0.03941],[1.583,1.0,83.8954,0.03934],[1.667,1.0,84.8943,0.03927],[1.75,1.0,85.7327,0.0393],[1.833,1.0,86.5388,0.03935],[1.917,1.0,87.3147,0.03941],[2.0,1.0,88.0671,0.03949],[2.083,1.0,88.8045,0.03958],[2.167,1.0,89.5322,0.03968],[2.25,1.0,90.2525,0.03979],[2.333,1.0,90.9657,0.0399],[2.417,1.0,91.6747,0.04002],[2.5,1.0,92.3799,0.04013],[2.583,1.0,93.0695,0.04025],[2.667,1.0,93.7591,0.04036],[2.75,1.0,94.4487,0.04048],[2.833,1.0,95.1345,0.04059],[2.917,1.0,95.805,0.04071],[3.0,1.0,96.4703,0.04082]],"kro_height_female":[[-0.326,1.0,30.9,0.071],[-0.307,1.0,32.0,0.071],[-0.287,1.0,33.2,0.075],[-0.268,1.0,34.5,0.077],[-0.249,1.0,35.9,0.08],[-0.23,1.0,37.3,0.081],[-0.211,1.0,38.8,0.079],[-0.192,1.83,39.94,0.07],[-0.172,1.6,41.25,0.069],[-0.153,1.31,42.69,0.067],[-0.134,2.79,44.4,0.062],[-0.115,1.84,45.61,0.058],[-0.096,1.11,47.28,0.059],[-0.077,1.54,48.36,0.048],[-0.057,1.03,49.48,0.047],[-0.038,1.0,50.4,0.045],[-0.019,1.0,51.2,0.043],[0.0,1.0,51.1112,0.0442],[0.083,1.0,53.7671,0.04385],[0.167,1.0,56.4215,0.04345],[0.25,1.0,59.0615,0.04297],[0.333,1.0,61.6049,0.0424],[0.417,1.0,64.0013,0.04176],[0.5,1.0,66.209,0.04111],[0.583,1.0,68.1761,0.04048],[0.667,1.0,69.8119,0.03997],[0.75,1.0,71.4477,0.03945],[0.833,1.0,72.8939,0.03904],[0.917,1.0,74.1919,0.03873],[1.0,1.0,75.3961,0.03852],[1.083,1.0,76.5093,0.03842],[1.167,1.0,77.4999,0.03846],[1.25,1.0,78.4905,0.03849],[1.333,1.0,79.4812,0.03853],[1.417,1.0,80.4718,0.03856],[1.5,1.0,81.4624,0.0386],[1.583,1.0,82.4526,0.03863],[1.667,1.0,83.3141,0.03878],[1.75,1.0,84.163,0.03894],[1.833,1.0,84.9836,0.03911],[1.917,1.0,85.7842,0.03929],[2.0,1.0,86.5663,0.03948],[2.083,1.0,87.3338,0.03968],[2.167,1.0,88.0902,0.03987],[2.25,1.0,88.8382,0.04007],[2.333,1.0,89.5772,0.04025],[2.417,1.0,90.3162,0.04043],[2.5,1.0,91.0553,0.04061],[2.583,1.0,91.7914,0.04077],[2.667,1.0,92.526,0.04092],[2.75,1.0,93.2606,0.04106],[2.833,1.0,93.9949,0.04121],[2.917,1.0,94.7248,0.04134],[3.0,1.0,95.451,0.04147]],"who_hc_male":[[0.0,1.0,34.4618,0.03686],[0.0192,1.0,35.1634,0.03472],[0.0383,1.0,35.8649,0.03258],[0.0575,1.0,36.5216,0.03197],[0.0767,1.0,37.0926,0.03148],[0.0958,1.0,37.601,0.03107],[0.115,1.0,38.0609,0.03072],[0.1342,1.0,38.4824,0.03041],[0.1533,1.0,38.8724,0.03014],[0.1725,1.0,39.2368,0.0299],[0.1916,1.0,39.5797,0.02969],[0.2108,1.0,39.9033,0.0295],[0.23,1.0,40.2096,0.02933],[0.2491,1.0,40.5008,0.02918],[0.2683,1.0,40.7785,0.02905],[0.2875,1.0,41.0436,0.02893],[0.3066,1.0,41.297,0.02882],[0.3258,1.0,41.5394,0.02872],[0.345,1.0,41.7715,0.02863],[0.3641,1.0,41.9939,0.02855],[0.3833,1.0,42.2071,0.02848],[0.4025,1.0,42.4115,0.02841],[0.4216,1.0,42.6076,0.02835],[0.4408,1.0,42.7957,0.0283],[0.46,1.0,42.9762,0.02825],[0.4791,1.0,43.1495,0.02821],[0.4983,1.0,43.316,0.02817],[0.5175,1.0,43.4761,0.02814],[0.5366,1.0,43.6298,0.0281],[0.5558,1.0,43.7777,0.02808],[0.5749,1.0,43.9198,0.02805],[0.5941,1.0,44.0566,0.02803],[0.6133,1.0,44.1883,0.02801],[0.6324,1.0,44.315,0.02799],[0.6516,1.0,44.4372,0.02798],[0.6708,1.0,44.5549,0.02796],[0.6899,1.0,44.6685,0.02795],[0.7091,1.0,44.7781,0.02794],[0.7283,1.0,44.884,0.02793],[0.7474,1.0,44.9864,0.02792],[0.7666,1.0,45.0853,0.02791],[0.7858,1.0,45.1809,0.02791],[0.8049,1.0,45.2734,0.0279],[0.8241,1.0,45.3629,0.0279],[0.8433,1.0,45.4496,0.02789],[0.8624,1.0,45.5336,0.02789],[0.8816,1.0,45.6149,0.02789],[0.9008,1.0,45.6937,0.02789],[0.9199,1.0,45.7701,0.02789],[0.9391,1.0,45.8443,0.02788],[0.9582,1.0,45.9163,0.02788],[0.9774,1.0,45.9862,0.02788],[0.9966,1.0,46.0541,0.02789],[1.0157,1.0,46.1202,0.02789],[1.0349,1.0,46.1845,0.02789],[1.0541,1.0,46.2471,0.02789],[1.0732,1.0,46.308,0.02789],[1.0924,1.0,46.3674,0.02789],[1.1116,1.0,46.4254,0.0279],[1.1307,1.0,46.4819,0.0279],[1.1499,1.0,46.5371,0.0279],[1.1691,1.0,46.591,0.02791],[1.1882,1.0,46.6438,0.02791],[1.2074,1.0,46.6953,0.02791],[1.2266,1.0,46.7457,0.02792],[1.2457,1.0,46.7951,0.02792],[1.2649,1.0,46.8435,0.02793],[1.2841,1.0,46.8909,0.02793],[1.3032,1.0,46.9374,0.02794],[1.3224,1.0,46.9831,0.02794],[1.3415,1.0,47.0279,0.02795],[1.3607,1.0,47.0719,0.02795],[1.3799,1.0,47.1152,0.02796],[1.399,1.0,47.1577,0.02797],[1.4182,1.0,47.1995,0.02797],[1.4374,1.0,47.2407,0.02798],[1.4565,1.0,47.2813,0.02798],[1.4757,1.0,47.3213,0.02799],[1.4949,1.0,47.3606,0.028],[1.514,1.0,47.3995,0.028],[1.5332,1.0,47.4378,0.02801],[1.5524,1.0,47.4756,0.02802],[1.5715,1.0,47.513,0.02802],[1.5907,1.0,47.5498,0.02803],[1.6099,1.0,47.5863,0.02804],[1.629,1.0,47.6223,0.02805],[1.6482,1.0,47.6579,0.02805],[1.6674,1.0,47.6931,0.02806],[1.6865,1.0,47.728,0.02807],[1.7057,1.0,47.7624,0.02808],[1.7248,1.0,47.7965,0.02809],[1.744,1.0,47.8303,0.0281],[1.7632,1.0,47.8637,0.0281],[1.7823,1.0,47.8968,0.02811],[1.8015,1.0,47.9296,0.02812],[1.8207,1.0,47.962,0.02813],[1.8398,1.0,47.9942,0.02814],[1.859,1.0,48.026,0.02815],[1.8782,1.0,48.0576,0.02816],[1.8973,1.0,48.0889,0.02816],[1.9165,1.0,48.1198,0.02817],[1.9357,1.0,48.1505,0.02818],[1.9548,1.0,48.1809,0.02819],[1.974,1.0,48.2111,0.0282],[1.9932,1.0,48.2409,0.02821],[2.0123,1.0,48.2705,0.02822],[2.0315,1.0,48.2998,0.02823],[2.0507,1.0,48.3288,0.02824],[2.0698,1.0,48.3576,0.02825],[2.089,1.0,48.3861,0.02826],[2.1081,1.0,48.4143,0.02827],[2.1273,1.0,48.4423,0.02828],[2.1465,1.0,48.47,0.02829],[2.1656,1.0,48.4974,0.0283],[2.1848,1.0,48.5246,0.02831],[2.204,1.0,48.5515,0.02832],[2.2231,1.0,48.5782,0.02833],[2.2423,1.0,48.6045,0.02834],[2.2615,1.0,48.6307,0.02835],[2.2806,1.0,48.6566,0.02835],[2.2998,1.0,48.6822,0.02836],[2.319,1.0,48.7076,0.02837],[2.3381,1.0,48.7327,0.02838],[2.3573,1.0,48.7576,0.02839],[2.3765,1.0,48.7822,0.0284],[2.3956,1.0,48.8066,0.02841],[2.4148,1.0,48.8307,0.02842],[2.4339,1.0,48.8546,0.02843],[2.4531,1.0,48.8783,0.02844],[2.4723,1.0,48.9017,0.02845],[2.4914,1.0,48.9248,0.02846],[2.5106,1.0,48.9478,0.02847],[2.5298,1.0,48.9705,0.02848],[2.5489,1.0,48.993,0.02849],[2.5681,1.0,49.0152,0.0285],[2.5873,1.0,49.0372,0.02851],[2.6064,1.0,49.059,0.02852],[2.6256,1.0,49.0806,0.02853],[2.6448,1.0,49.1019,0.02854],[2.6639,1.0,49.123,0.02855],[2.6831,1.0,49.1439,0.02856],[2.7023,1.0,49.1646,0.02857],[2.7214,1.0,49.1851,0.02858],[2.7406,1.0,49.2054,0.02859],[2.7598,1.0,49.2255,0.0286],[2.7789,1.0,49.2454,0.02861],[2.7981,1.0,49.265,0.02861],[2.8172,1.0,49.2845,0.02862],[2.8364,1.0,49.3038,0.02863],[2.8556,1.0,49.3229,0.02864],[2.8747,1.0,49.3419,0.02865],[2.8939,1.0,49.3606,0.02866],[2.9131,1.0,49.3792,0.02867],[2.9322,1.0,49.3976,0.02868],[2.9514,1.0,49.4158,0.02869],[2.9706,1.0,49.4338,0.0287],[2.9897,1.0,49.4517,0.0287],[3.0089,1.0,49.4694,0.02871],[3.0281,1.0,49.487,0.02872],[3.0472,1.0,49.5044,0.02873],[3.05,1.0,49.5068,0.02873]],"who_hc_female":[[0.0,1.0,33.8787,0.03496],[0.0192,1.0,34.5529,0.03374],[0.0383,1.0,35.2272,0.03251],[0.0575,1.0,35.843,0.03231],[0.0767,1.0,36.3761,0.03215],[0.0958,1.0,36.8472,0.03202],[0.115,1.0,37.2711,0.03191],[0.1342,1.0,37.6584,0.03182],[0.1533,1.0,38.0167,0.03173],[0.1725,1.0,38.3516,0.03166],[0.1916,1.0,38.6673,0.03158],[0.2108,1.0,38.9661,0.03152],[0.23,1.0,39.2501,0.03146],[0.2491,1.0,39.521,0.0314],[0.2683,1.0,39.7802,0.03135],[0.2875,1.0,40.0284,0.0313],[0.3066,1.0,40.2664,0.03125],[0.3258,1.0,40.4946,0.03121],[0.345,1.0,40.7136,0.03117],[0.3641,1.0,40.9239,0.03112],[0.3833,1.0,41.1259,0.03108],[0.4025,1.0,41.32,0.03105],[0.4216,1.0,41.5066,0.03101],[0.4408,1.0,41.6861,0.03098],[0.46,1.0,41.8589,0.03094],[0.4791,1.0,42.0253,0.03091],[0.4983,1.0,42.1855,0.03088],[0.5175,1.0,42.3398,0.03085],[0.5366,1.0,42.4885,0.03082],[0.5558,1.0,42.6319,0.03079],[0.5749,1.0,42.7701,0.03076],[0.5941,1.0,42.9034,0.03073],[0.6133,1.0,43.032,0.0307],[0.6324,1.0,43.1561,0.03068],[0.6516,1.0,43.2759,0.03065],[0.6708,1.0,43.3915,0.03063],[0.6899,1.0,43.5033,0.0306],[0.7091,1.0,43.6113,0.03058],[0.7283,1.0,43.7157,0.03056],[0.7474,1.0,43.8167,0.03053],[0.7666,1.0,43.9145,0.03051],[0.7858,1.0,44.0092,0.03049],[0.8049,1.0,44.101,0.03047],[0.8241,1.0,44.19,0.03045],[0.8433,1.0,44.2763,0.03043],[0.8624,1.0,44.3601,0.0304],[0.8816,1.0,44.4414,0.03038],[0.9008,1.0,44.5205,0.03037],[0.9199,1.0,44.5973,0.03035],[0.9391,1.0,44.672,0.03033],[0.9582,1.0,44.7447,0.03031],[0.9774,1.0,44.8154,0.03029],[0.9966,1.0,44.8844,0.03027],[1.0157,1.0,44.9515,0.03025],[1.0349,1.0,45.0169,0.03024],[1.0541,1.0,45.0808,0.03022],[1.0732,1.0,45.143,0.0302],[1.0924,1.0,45.2038,0.03019],[1.1116,1.0,45.2632,0.03017],[1.1307,1.0,45.3212,0.03015],[1.1499,1.0,45.3779,0.03014],[1.1691,1.0,45.4334,0.03012],[1.1882,1.0,45.4876,0.0301],[1.2074,1.0,45.5408,0.03009],[1.2266,1.0,45.5928,0.03007],[1.2457,1.0,45.6438,0.03006],[1.2649,1.0,45.6938,0.03004],[1.2841,1.0,45.7429,0.03003],[1.3032,1.0,45.791,0.03001],[1.3224,1.0,45.8383,0.03],[1.3415,1.0,45.8848,0.02999],[1.3607,1.0,45.9305,0.02997],[1.3799,1.0,45.9755,0.02996],[1.399,1.0,46.0197,0.02994],[1.4182,1.0,46.0633,0.02993],[1.4374,1.0,46.1062,0.02992],[1.4565,1.0,46.1485,0.0299],[1.4757,1.0,46.1903,0.02989],[1.4949,1.0,46.2315,0.02988],[1.514,1.0,46.2721,0.02986],[1.5332,1.0,46.3123,0.02985],[1.5524,1.0,46.352,0.02984],[1.5715,1.0,46.3912,0.02983],[1.5907,1.0,46.4301,0.02981],[1.6099,1.0,46.4685,0.0298],[1.629,1.0,46.5065,0.02979],[1.6482,1.0,46.5441,0.02978],[1.6674,1.0,46.5814,0.02977],[1.6865,1.0,46.6183,0.02975],[1.7057,1.0,46.655,0.02974],[1.7248,1.0,46.6913,0.02973],[1.744,1.0,46.7273,0.02972],[1.7632,1.0,46.763,0.02971],[1.7823,1.0,46.7984,0.0297],[1.8015,1.0,46.8335,0.02969],[1.8207,1.0,46.8684,0.02967],[1.8398,1.0,46.903,0.02966],[1.859,1.0,46.9373,0.02965],[1.8782,1.0,46.9714,0.02964],[1.8973,1.0,47.0053,0.02963],[1.9165,1.0,47.0388,0.02962],[1.9357,1.0,47.0722,0.02961],[1.9548,1.0,47.1052,0.0296],[1.974,1.0,47.138,0.02959],[1.9932,1.0,47.1706,0.02958],[2.0123,1.0,47.2029,0.02957],[2.0315,1.0,47.235,0.02956],[2.0507,1.0,47.2668,0.02955],[2.0698,1.0,47.2983,0.02954],[2.089,1.0,47.3296,0.02953],[2.1081,1.0,47.3606,0.02952],[2.1273,1.0,47.3913,0.02951],[2.1465,1.0,47.4218,0.0295],[2.1656,1.0,47.452,0.02949],[2.1848,1.0,47.482,0.02948],[2.204,1.0,47.5116,0.02947],[2.2231,1.0,47.541,0.02946],[2.2423,1.0,47.5701,0.02945],[2.2615,1.0,47.5989,0.02944],[2.2806,1.0,47.6275,0.02943],[2.2998,1.0,47.6557,0.02942],[2.319,1.0,47.6837,0.02941],[2.3381,1.0,47.7114,0.0294],[2.3573,1.0,47.7388,0.0294],[2.3765,1.0,47.7659,0.02939],[2.3956,1.0,47.7927,0.02938],[2.4148,1.0,47.8193,0.02937],[2.4339,1.0,47.8456,0.02936],[2.4531,1.0,47.8716,0.02935],[2.4723,1.0,47.8973,0.02934],[2.4914,1.0,47.9227,0.02933],[2.5106,1.0,47.9479,0.02933],[2.5298,1.0,47.9728,0.02932],[2.5489,1.0,47.9975,0.02931],[2.5681,1.0,48.0218,0.0293],[2.5873,1.0,48.0459,0.02929],[2.6064,1.0,48.0698,0.02928],[2.6256,1.0,48.0934,0.02927],[2.6448,1.0,48.1168,0.02927],[2.6639,1.0,48.1399,0.02926],[2.6831,1.0,48.1628,0.02925],[2.7023,1.0,48.1854,0.02924],[2.7214,1.0,48.2078,0.02923],[2.7406,1.0,48.23,0.02923],[2.7598,1.0,48.252,0.02922],[2.7789,1.0,48.2737,0.02921],[2.7981,1.0,48.2953,0.0292],[2.8172,1.0,48.3166,0.02919],[2.8364,1.0,48.3377,0.02919],[2.8556,1.0,48.3586,0.02918],[2.8747,1.0,48.3793,0.02917],[2.8939,1.0,48.3998,0.02916],[2.9131,1.0,48.4201,0.02916],[2.9322,1.0,48.4403,0.02915],[2.9514,1.0,48.4602,0.02914],[2.9706,1.0,48.4799,0.02913],[2.9897,1.0,48.4995,0.02913],[3.0089,1.0,48.5189,0.02912],[3.0281,1.0,48.5381,0.02911],[3.0472,1.0,48.5572,0.0291],[3.05,1.0,48.5599,0.0291]]};
const VOIGT_MAX_SSW = 39;

/* ===== Speicher: Home Assistant + Offline-Puffer ===== */
const KEY = window.__babyKey || "babyTagebuch.ha.v1", OLDKEY = "babyTagebuch.v1";
const DEF = () => ({child:{name:"",sex:"",birth:"",gaW:40,gaD:0,bw:"",bl:"",bhc:""},
  events:[], active:{feed:null,sleep:null}, daily:{}, dailyItems:["Vitamin D"],
  uDone:{}, settings:{night:false}, lastExport:0, created:Date.now()});
let S, SY = {base:{}, pending:{}, rev:0, undo:[]};
let storageWarn = false;
function load(){
  try{ const raw = localStorage.getItem(KEY);
    if(raw){ const d = JSON.parse(raw); S = Object.assign(DEF(), d.S||{}); SY = Object.assign({base:{},pending:{},rev:0,undo:[]}, d.SY||{}); }
    else S = DEF();
  }catch(e){ S = DEF(); storageWarn = true; }
}
function persist(){ try{ localStorage.setItem(KEY, JSON.stringify({S, SY})); storageWarn=false; }catch(e){ storageWarn = true; } }
function recordsOf(s){
  const r = {child:s.child, dailyItems:s.dailyItems, uDone:s.uDone, active:s.active};
  for(const [k,v] of Object.entries(s.daily||{})) r["d:"+k] = v;
  for(const e of s.events) r["e:"+e.id] = e;
  return r;
}
function save(noUndo){
  const now = Date.now(), recs = recordsOf(S), prev = {};
  for(const [k,v] of Object.entries(recs)){ const j = JSON.stringify(v);
    if(SY.base[k] !== j){ prev[k] = k in SY.base ? SY.base[k] : null; SY.base[k] = j; SY.pending[k] = {k, u:now, v:JSON.parse(j)}; } }
  for(const k of Object.keys(SY.base)) if(!(k in recs)){ prev[k] = SY.base[k]; delete SY.base[k]; SY.pending[k] = {k, u:now, d:true}; }
  if(!noUndo && Object.keys(prev).length){ SY.undo = SY.undo || [];
    const last = SY.undo[SY.undo.length-1];
    if(undoGroupOpen && last){ for(const [k,j] of Object.entries(prev)) if(!(k in last.prev)) last.prev[k] = j; last.desc = undoDesc(last.prev, recs); }
    else { SY.undo.push({prev, desc:undoDesc(prev, recs), t:now}); if(SY.undo.length>30) SY.undo.shift(); }
    undoGroupOpen = true; setTimeout(()=>{ undoGroupOpen = false; }, 0); }
  persist(); updSync(); scheduleSync();
}
let undoGroupOpen = false;
function plain(h){ const d=document.createElement("div"); d.innerHTML=h; return d.textContent; }
function undoDesc(prev, recs){
  const ks = Object.keys(prev), ek = ks.filter(k=>k.startsWith("e:"));
  if(ek.length===1){ const k=ek[0];
    if(prev[k]===null) return plain(evDesc(recs[k]))+" (neu)";
    if(!(k in recs)) return plain(evDesc(JSON.parse(prev[k])))+" (gelöscht)";
    return plain(evDesc(recs[k]))+" (geändert)"; }
  if(ek.length>1) return ek.length+" Einträge";
  if(ks.includes("active")) return "Timer";
  if(ks.some(k=>k.startsWith("d:"))) return "Häkchen";
  if(ks.includes("child")) return "Kinddaten";
  if(ks.includes("uDone")) return "Vorsorge abgehakt";
  if(ks.includes("dailyItems")) return "Tägliche Gaben";
  return "letzte Änderung";
}
function undo(){
  const u = (SY.undo||[]).pop(); if(!u){ toast("Nichts zum Rückgängigmachen"); return; }
  for(const [k,j] of Object.entries(u.prev)) applyRec(k, j===null ? null : JSON.parse(j));
  save(true); closeSheet(); render(); toast("↶ Rückgängig: "+u.desc);
}
let toastT;
function toast(msg){ const el=document.getElementById("toast"); if(!el) return; el.textContent=msg; el.classList.add("on"); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove("on"),3500); }
function applyRec(k, v){
  if(k==="child") S.child = v || DEF().child;
  else if(k==="dailyItems") S.dailyItems = v || [];
  else if(k==="uDone") S.uDone = v || {};
  else if(k==="active") S.active = v || {feed:null,sleep:null};
  else if(k.startsWith("d:")){ if(v) S.daily[k.slice(2)] = v; else delete S.daily[k.slice(2)]; }
  else if(k.startsWith("e:")){ const id=k.slice(2), i=S.events.findIndex(e=>e.id===id);
    if(v){ if(i>=0) S.events[i]=v; else S.events.push(v); } else if(i>=0) S.events.splice(i,1);
    S.events.sort((a,b)=>a.start-b.start); }
}
let syncing=false, syncAgain=false, syncTimer=null, online=null, subscribed=false;
function scheduleSync(ms=300){ clearTimeout(syncTimer); syncTimer = setTimeout(sync, ms); }
async function sync(){
  const api = window.__babyApi; if(!api || !api.ready()){ online=false; updSync(); return; }
  if(syncing){ syncAgain = true; return; }
  syncing = true;
  try{
    const batch = Object.values(SY.pending).slice(0, 500);
    const sent = {}; batch.forEach(c => sent[c.k] = c.u);
    const res = await api.sync({since:SY.rev,
      changes: batch.map(c => c.d ? {k:c.k, u:c.u, d:true} : {k:c.k, u:c.u, v:c.v})});
    for(const k in sent) if(SY.pending[k] && SY.pending[k].u === sent[k]) delete SY.pending[k];
    if(res.reset){ // Server kennt weniger als dieses Gerät: alles erneut hochladen
      const now = Date.now();
      for(const [k,j] of Object.entries(SY.base)) if(!SY.pending[k]) SY.pending[k] = {k, u:now, v:JSON.parse(j)};
    }
    let changed = false;
    for(const [k,r] of Object.entries(res.records||{})){
      if(SY.pending[k]) continue;
      if(r.d){ if(k in SY.base){ delete SY.base[k]; applyRec(k, null); changed = true; } }
      else { const j = JSON.stringify(r.v); if(SY.base[k] !== j){ SY.base[k] = j; applyRec(k, JSON.parse(j)); changed = true; } }
    }
    SY.rev = res.rev; online = true; persist();
    if(changed) softRender();
    if(Object.keys(SY.pending).length) syncAgain = true;
  }catch(e){ online = false; console.warn("Baby-Tagebuch: Sync fehlgeschlagen", e);
    if(e && e.auth){ if(view==="heute"||view==="mehr") softRender(); } else scheduleSync(15000); }
  finally{ syncing = false; updSync(); if(syncAgain){ syncAgain = false; scheduleSync(50); } }
}
async function subscribe(){
  const api = window.__babyApi; if(!api || !api.subscribe || !api.ready() || subscribed) return; subscribed = true;
  try{ await api.subscribe(ev => { if(ev && ev.rev > SY.rev) scheduleSync(100); }); }
  catch(e){ subscribed = false; console.warn("Baby-Tagebuch: Abo fehlgeschlagen", e); }
}
function softRender(){ const a = document.activeElement, m = document.getElementById("main");
  if(a && m && m.contains(a) && /INPUT|SELECT|TEXTAREA/.test(a.tagName)) return; render(); }
function updSync(){ const ub = document.getElementById("undoBtn");
  if(ub){ const n=(SY.undo||[]).length; ub.disabled=!n; ub.style.opacity=n?1:.35; ub.title=n?"Rückgängig: "+SY.undo[n-1].desc:"Nichts zum Rückgängigmachen"; }
  const el = document.getElementById("savedMark"); if(!el) return;
  const n = Object.keys(SY.pending).length;
  const api = window.__babyApi, login = api && api.needsLogin && api.needsLogin();
  el.textContent = login ? "🔑 nicht angemeldet"+(n?" ("+n+")":"") : online===false ? "⚠ offline"+(n?" ("+n+")":"") : n ? "⏳ "+n : online ? "☁ synchron" : "";
  el.style.color = (login || online===false) ? "var(--warn)" : "var(--ok)"; }
/* ===== Verbindung / Offline-App ===== */
function isStandalone(){ try{ return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; }catch(e){ return false; } }
function authHint(){ const api = window.__babyApi; if(!api || !api.needsLogin || !api.needsLogin()) return "";
  const n = Object.keys(SY.pending).length;
  return `<div class="warnbox">Nicht mit Home Assistant angemeldet. Eintragen geht trotzdem – ${n?n+" Änderungen warten":"alles bleibt"} auf diesem Gerät, bis du dich anmeldest.<div class="row" style="margin-top:8px"><button class="b sm pri" onclick="__babyApi.login()">Jetzt anmelden</button></div>${navigator.onLine===false?'<div class="mute" style="margin-top:6px">Zum Anmelden ist eine Verbindung nötig.</div>':""}</div>`; }
function installHint(){ if(isStandalone()) return "";
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
  return `<div class="okbox"><b>Auf den Startbildschirm legen</b>, damit die App auch ohne Netz startet: ${ios?"in Safari unten auf <b>Teilen</b> → <b>Zum Home-Bildschirm</b>":"im Browser-Menü (⋮) <b>App installieren</b> bzw. <b>Zum Startbildschirm hinzufügen</b>"}. Danach die App nur noch über das Symbol öffnen${ios?" und dort einmal anmelden":""}.${window.isSecureContext===false?"<br><b>Achtung:</b> Offline klappt nur über die https-Adresse (Nabu Casa), nicht über die IP-Adresse.":""}</div>`; }
function connCard(){ const api = window.__babyApi; if(!api) return "";
  if(api.kind === "panel") return `<div class="card"><h2>OFFLINE-APP FÜRS HANDY</h2><div class="mute">Für Orte ohne Netz, z. B. das Krankenhaus: eine eigene App auf dem Startbildschirm, die ohne Verbindung startet. Einträge werden abgeglichen, sobald wieder Netz da ist.</div><div class="row" style="margin-top:10px"><button class="b pri" onclick="openPwa()">📲 Offline-App öffnen</button><button class="b sm" style="flex:0 0 auto" onclick="copyPwa()">Link kopieren</button></div><div class="mute" id="pwaUrl" style="margin-top:6px;word-break:break-all"></div></div>`;
  const st = api.needsLogin() ? "nicht angemeldet" : online===false ? "angemeldet – gerade keine Verbindung" : online ? "angemeldet und verbunden" : "angemeldet";
  return `<div class="card"><h2>VERBINDUNG ZU HOME ASSISTANT</h2><div>Status: <b>${st}</b></div><div class="mute">${esc(location.host)}</div>
  ${api.needsLogin()?`<button class="b pri" style="width:100%;margin-top:10px" onclick="__babyApi.login()">Mit Home Assistant anmelden</button><button class="b sm" style="margin-top:8px" onclick="tokenLogin()">Anmeldung klappt nicht? Mit Token anmelden</button>`:`<button class="b sm" style="margin-top:10px" onclick="if(confirm('Abmelden? Noch nicht abgeglichene Einträge bleiben auf diesem Gerät.')){__babyApi.logout();render();updSync();}">Abmelden</button>`}${installHint()}</div>`; }
function tokenLogin(){ const t = prompt("Langzeit-Zugangstoken einfügen (Home Assistant → Profil → Sicherheit → Langlebige Zugangstoken → Token erstellen):"); if(t){ __babyApi.useToken(t); toast("Token gespeichert – wird beim nächsten Abgleich geprüft"); } }
async function pwaUrl(){ const api = window.__babyApi; let u = null;
  try{ const i = api && api.info ? await api.info() : null; u = i && i.app_url; }catch(e){}
  if(!u){ let o; try{ o = window.top.location.origin; }catch(e){ o = location.origin; } u = o + "/baby_tagebuch_static/app/index.html"; }
  const el = document.getElementById("pwaUrl"); if(el) el.textContent = u; return u; }
async function openPwa(){ const u = await pwaUrl(); try{ (window.top||window).open(u, "_blank"); }catch(e){ location.href = u; } }
async function copyPwa(){ const u = await pwaUrl(); try{ await navigator.clipboard.writeText(u); toast("Link kopiert"); }catch(e){ toast("Link: "+u); } }
function oldLocalData(){ try{ const raw = localStorage.getItem(OLDKEY); if(!raw) return null; const d = JSON.parse(raw); return d && Array.isArray(d.events) && d.events.length ? d : null; }catch(e){ return null; } }
function migrateOld(){ const d = oldLocalData(); if(!d) return;
  const ids = new Set(S.events.map(e=>e.id)); let n=0;
  for(const e of d.events) if(!ids.has(e.id)){ S.events.push(e); n++; }
  S.events.sort((a,b)=>a.start-b.start);
  if(!S.child.birth && d.child) S.child = d.child;
  for(const [k,v] of Object.entries(d.daily||{})) if(!S.daily[k]) S.daily[k]=v;
  if(d.uDone) S.uDone = Object.assign({}, d.uDone, S.uDone);
  S.settings.migrated = true; save(); render(); alert(n+" Einträge übernommen.");
}
function skipMigrate(){ S.settings.migrated = true; persist(); render(); }

/* ===== Hilfen ===== */
const $ = s => document.querySelector(s);
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const pad = n => String(n).padStart(2,"0");
const fmtT = ts => { const d=new Date(ts); return pad(d.getHours())+":"+pad(d.getMinutes()); };
const fmtD = ts => new Date(ts).toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"});
const fmtDs = ts => new Date(ts).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});
const dayKey = ts => { const d=new Date(ts); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); };
const toInput = ts => { const d=new Date(ts); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+"T"+pad(d.getHours())+":"+pad(d.getMinutes()); };
const fromInput = v => v ? new Date(v).getTime() : NaN;
const esc = s => String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function dur(sec){ sec=Math.max(0,Math.round(sec)); const h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60;
  return h? h+":"+pad(m)+":"+pad(s) : pad(m)+":"+pad(s); }
function durMin(sec){ const m=Math.round(sec/60); return m<60? m+" min" : Math.floor(m/60)+" h "+pad(m%60)+" min"; }
function ago(ts){ const m=Math.round((Date.now()-ts)/60000); if(m<1) return "gerade eben"; if(m<60) return "vor "+m+" min";
  return "vor "+Math.floor(m/60)+" h "+pad(m%60)+" min"; }
const num = v => { const n = parseFloat(String(v).replace(",",".")); return isFinite(n)?n:null; };

/* ===== Alter & Perzentilen ===== */
const birthTs = () => S.child.birth ? new Date(S.child.birth).getTime() : null;
const gaTotalDays = () => (+S.child.gaW||40)*7 + (+S.child.gaD||0);
const isPreterm = () => gaTotalDays() < 37*7;
function ageDays(ts){ const b=birthTs(); return b==null?null:(ts-b)/864e5; }
function refAgeYears(ts){ // korrigiertes Alter bei Frühgeborenen bis 2 J. (korrigiert)
  const d = ageDays(ts); if(d==null) return null;
  let y = d/365.25;
  if(isPreterm()){ const yc = y - (280-gaTotalDays())/365.25; if(yc < 2) return yc; }
  return y;
}
function ageText(ts){
  const d = ageDays(ts); if(d==null) return "";
  const days = Math.floor(d);
  if(days < 0) return "";
  if(days < 28) return days===0?"Tag 0":days+(days===1?" Tag":" Tage");
  if(days < 7*13){ const w=Math.floor(days/7), r=days%7; return w+" Wo"+(r?" + "+r+" T":""); }
  const b=new Date(birthTs()), n=new Date(ts);
  let m=(n.getFullYear()-b.getFullYear())*12+n.getMonth()-b.getMonth(); if(n.getDate()<b.getDate()) m--;
  return m<24? m+" Monate" : Math.floor(m/12)+" J "+(m%12)+" M";
}
function lmsAt(key, age){
  const t = REF[key]; if(!t || age==null) return null;
  if(age < t[0][0]-1e-6 || age > t[t.length-1][0]+1e-6) return null;
  for(let i=0;i<t.length-1;i++){
    const a=t[i], b=t[i+1];
    if(age>=a[0]-1e-9 && age<=b[0]+1e-9){
      const f = b[0]===a[0]?0:(age-a[0])/(b[0]-a[0]);
      return [a[1]+(b[1]-a[1])*f, a[2]+(b[2]-a[2])*f, a[3]+(b[3]-a[3])*f];
    }
  }
  return t[t.length-1].slice(1);
}
function zOf(y,p){ const [nu,mu,s]=p; return Math.abs(nu)<1e-6 ? Math.log(y/mu)/s : (Math.pow(y/mu,nu)-1)/(nu*s); }
function yOf(z,p){ const [nu,mu,s]=p; if(Math.abs(nu)<1e-6) return mu*Math.exp(s*z); const base=1+nu*s*z; return base>0? mu*Math.pow(base,1/nu) : NaN; }
function Phi(z){ const t=1/(1+0.2316419*Math.abs(z)); const d=0.3989423*Math.exp(-z*z/2);
  const p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274)))); return z>0?1-p:p; }
const Z = {3:-1.880794,10:-1.281552,25:-0.674490,50:0,75:0.674490,90:1.281552,97:1.880794};
function refKey(kind){ const sx=S.child.sex; if(!sx) return null;
  return kind==="weight"?"kro_weight_"+sx : kind==="length"?"kro_height_"+sx : "who_hc_"+sx; }
function pctOf(kind, value, ts){ // value: Gewicht in g, Länge/KU in cm
  const key=refKey(kind); if(!key||value==null) return null;
  const age=refAgeYears(ts); const p=lmsAt(key, age); if(!p) return null;
  const y = kind==="weight"? value/1000 : value;
  const z = zOf(y,p); return {z, pct:Phi(z)*100, src: kind==="hc"?"WHO":(age<0?"Voigt":"KH")};
}
function pctText(r){ if(!r) return "–"; const p=r.pct; let s = p<3?"< P3": p>97?"> P97" : "P"+Math.round(p);
  return s+" <span class='mute'>(SDS "+(r.z>=0?"+":"")+r.z.toFixed(2).replace(".",",")+")</span>"; }
function birthClass(){ // Voigt nach vollendeter SSW
  const c=S.child, sx=c.sex, w=+c.gaW; if(!sx||!w) return null;
  const res={};
  if(w>=23 && w<=VOIGT_MAX_SSW){
    const age=(w-40)*7/365.25;
    for(const [k,kind,val] of [["w","weight",num(c.bw)],["l","length",num(c.bl)]]){
      if(val==null) continue; const p=lmsAt(refKey(kind),age); if(!p) continue;
      const y=kind==="weight"?val/1000:val; const z=zOf(y,p); res[k]={z,pct:Phi(z)*100};
    }
    res.src="Voigt";
  } else res.src="fehlt";
  if(res.w){ res.cls = res.w.pct<10?"SGA (< P10)": res.w.pct>90?"LGA (> P90)":"AGA (P10–P90)"; }
  return res;
}

/* ===== Ereignisse ===== */
const TYPES = {
  feed:{ic:"🤱",n:"Stillen"}, bottle:{ic:"🍼",n:"Fläschchen"}, pump:{ic:"🥛",n:"Abpumpen"},
  diaper:{ic:"🧷",n:"Windel"}, sleep:{ic:"😴",n:"Schlaf"}, growth:{ic:"📏",n:"Messung"},
  temp:{ic:"🌡️",n:"Temperatur"}, med:{ic:"💊",n:"Medikament"}, vacc:{ic:"💉",n:"Impfung"}, note:{ic:"📝",n:"Notiz"}
};
const STOOL = {gelb:"gelb",senf:"senfgelb",gruen:"grün",braun:"braun",mekonium:"schwarz-grün (Mekonium)",hell:"hell / lehmfarben / weißlich",rot:"rot / blutig",schwarz:"schwarz (nach Mekoniumphase)"};
const STOOL_ALERT = {hell:"Heller, lehmfarbener oder weißlicher Stuhl kann auf eine Gallenwegserkrankung hinweisen – bitte zeitnah kinderärztlich abklären (Stuhlfarbkarte).",
  rot:"Blut im Stuhl bitte kinderärztlich abklären.", schwarz:"Schwarzer Stuhl nach der Mekoniumphase bitte kinderärztlich abklären."};
function addEvent(e){ e.id=uid(); S.events.push(e); S.events.sort((a,b)=>a.start-b.start); save(); }
function evDesc(e){
  switch(e.type){
    case "feed": { const parts=[]; if(e.L) parts.push("L "+durMin(e.L)); if(e.R) parts.push("R "+durMin(e.R));
      return "Stillen · "+(parts.join(" · ")||"–")+(e.note?" · "+esc(e.note):""); }
    case "bottle": return "Fläschchen · "+(e.ml??"?")+" ml"+(e.kind?" · "+esc(e.kind):"");
    case "pump": return "Abgepumpt · "+((+e.mlL||0)+(+e.mlR||0))+" ml"+(e.mlL||e.mlR?" (L "+(e.mlL||0)+" / R "+(e.mlR||0)+")":"");
    case "diaper": { const a=[]; if(e.wet) a.push("nass"); if(e.stool) a.push("Stuhl"+(e.color?" ("+STOOL[e.color]+")":""));
      return "Windel · "+(a.join(" + ")||"trocken"); }
    case "sleep": return "Schlaf · "+(e.end? durMin((e.end-e.start)/1000)+" bis "+fmtT(e.end):"läuft");
    case "growth": { const a=[]; if(e.weight) a.push(e.weight+" g"); if(e.length) a.push(e.length+" cm"); if(e.hc) a.push("KU "+e.hc+" cm");
      return "Messung · "+a.join(" · "); }
    case "temp": return "Temperatur · "+String(e.c).replace(".",",")+" °C"+(e.method?" ("+esc(e.method)+")":"");
    case "med": return "Medikament · "+esc(e.name)+(e.dose?" · "+esc(e.dose):"");
    case "vacc": return "Impfung · "+esc(e.name);
    case "note": return (e.milestone?"⭐ Meilenstein · ":"Notiz · ")+esc(e.text);
  }
  return e.type;
}
const evsOf = (type, from, to=Infinity) => S.events.filter(e=>(!type||e.type===type) && e.start>=from && e.start<to);
const lastOf = type => { for(let i=S.events.length-1;i>=0;i--) if(S.events[i].type===type) return S.events[i]; return null; };
const startOfDay = ts => { const d=new Date(ts); d.setHours(0,0,0,0); return d.getTime(); };

/* ===== Still-Timer ===== */
function feedSides(f){ let L=0,R=0; const now=Date.now();
  for(const s of f.segs){ const t=((s.end||now)-s.start)/1000; if(s.side==="L") L+=t; else R+=t; } return {L,R}; }
function feedStart(side){
  const f=S.active.feed;
  if(!f){ S.active.feed={segs:[{side,start:Date.now(),end:null}]}; }
  else { const cur=f.segs[f.segs.length-1];
    if(cur && !cur.end){ if(cur.side===side){ save(); render(); return; } cur.end=Date.now(); }
    f.segs.push({side,start:Date.now(),end:null}); }
  save(); render();
}
function feedPause(){ const f=S.active.feed; if(!f) return; const cur=f.segs[f.segs.length-1];
  if(cur && !cur.end) cur.end=Date.now(); else f.segs.push({side:cur?cur.side:"L",start:Date.now(),end:null});
  save(); render(); }
function feedStop(){ const f=S.active.feed; if(!f) return; const cur=f.segs[f.segs.length-1]; if(cur&&!cur.end) cur.end=Date.now();
  const {L,R}=feedSides(f); const lastSide=f.segs[f.segs.length-1].side;
  addEvent({type:"feed",start:f.segs[0].start,end:cur.end,L:Math.round(L),R:Math.round(R),last:lastSide});
  S.active.feed=null; save(); render(); }
function feedCancel(){ if(confirm("Laufendes Stillen verwerfen?")){ S.active.feed=null; save(); render(); } }
function nextSide(){ const l=lastOf("feed"); if(!l) return null; return (l.last||(l.R&&!l.L?"R":"L"))==="L"?"R":"L"; }
function sleepToggle(){ if(S.active.sleep){ addEvent({type:"sleep",start:S.active.sleep,end:Date.now()}); S.active.sleep=null; }
  else S.active.sleep=Date.now(); save(); render(); }

/* ===== Ansichten ===== */
let view="heute", filter="", growthRange=6, tick;
function render(){
  document.body.classList.toggle("night", !!S.settings.night);
  
  const c=S.child; const now=Date.now();
  $("#hTitle").innerHTML = esc(c.name||"Baby")+(birthTs()?" <span class='sub'>· "+ageText(now)+(isPreterm()&&refAgeYears(now)<2?" · korr. "+korrText(now):"")+"</span>":"");
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.v===view));
  const m=$("#main");
  m.innerHTML = ({heute:vHeute,verlauf:vVerlauf,wachstum:vWachstum,statistik:vStatistik,mehr:vMehr})[view]();
  clearInterval(tick);
  if(view==="heute" && (S.active.feed||S.active.sleep)) tick=setInterval(updTimers,1000);
}
function korrText(ts){ const y=refAgeYears(ts); if(y==null) return ""; const d=Math.round(y*365.25);
  if(d<0){ const ga=gaTotalDays()+Math.floor(ageDays(ts)); return Math.floor(ga/7)+"+"+(ga%7)+" SSW"; }
  if(d<91) return Math.floor(d/7)+" Wo"; return Math.floor(d/30.44)+" Mo"; }
function updTimers(){
  const f=S.active.feed; if(f){ const {L,R}=feedSides(f); const el=$("#fTot"); if(el){ el.textContent=dur(L+R); $("#fL").textContent=dur(L); $("#fR").textContent=dur(R);} }
  if(S.active.sleep){ const el=$("#sTot"); if(el) el.textContent=dur((Date.now()-S.active.sleep)/1000); }
}
function setupHint(){ return !S.child.birth||!S.child.sex ? `<div class="warnbox">Bitte zuerst unter <b>Mehr → Kind</b> Geburtsdatum, Geschlecht und SSW eintragen – sonst gibt es keine Perzentilen und U-Termine. <button class="b sm" onclick="go('mehr')">Jetzt eintragen</button></div>`:""; }
function migrateHint(){ const d=!S.settings.migrated&&oldLocalData(); return d?`<div class="okbox">Auf diesem Gerät liegen noch ${d.events.length} Einträge aus der Offline-Version. <div class="row" style="margin-top:8px"><button class="b sm pri" onclick="migrateOld()">Übernehmen</button><button class="b sm" onclick="skipMigrate()">Nein danke</button></div></div>`:""; }
function backupHint(){ const days=(Date.now()-(S.lastExport||S.created))/864e5;
  if(S.events.length>5 && days>7) return `<div class="warnbox">Letzte Sicherung ${S.lastExport?"vor "+Math.floor(days)+" Tagen":"noch nie"}. Die Daten liegen nur in diesem Browser. <button class="b sm" onclick="exportJSON()">Jetzt sichern</button></div>`; return ""; }

function vHeute(){
  const now=Date.now(), sod=startOfDay(now), d24=now-864e5;
  const f=S.active.feed; let h=authHint()+setupHint()+migrateHint();
  if(storageWarn) h+=`<div class="warnbox">Speichern im Browser ist blockiert (privater Modus?). Daten gehen beim Schließen verloren.</div>`;
  // Stillen
  const ns=nextSide(); const lf=lastOf("feed");
  h+=`<div class="card"><h2>STILLEN</h2>`;
  if(f){ const {L,R}=feedSides(f); const cur=f.segs[f.segs.length-1]; const running=cur&&!cur.end;
    h+=`<div class="timer" id="fTot">${dur(L+R)}</div>
    <div class="sides"><div>Links<b id="fL" style="color:var(--l)">${dur(L)}</b></div><div>Rechts<b id="fR" style="color:var(--r)">${dur(R)}</b></div></div>
    <div class="mute" style="text-align:center;margin-bottom:8px">${running?"läuft: "+(cur.side==="L"?"links":"rechts"):"pausiert"}</div>
    <div class="row"><button class="b L" onclick="feedStart('L')">Links</button><button class="b R" onclick="feedStart('R')">Rechts</button></div>
    <div class="row" style="margin-top:8px"><button class="b" onclick="feedPause()">${running?"Pause":"Weiter"}</button><button class="b pri" onclick="feedStop()">Fertig</button></div>
    <div style="text-align:center;margin-top:8px"><button class="b sm" onclick="feedCancel()">verwerfen</button></div>`;
  } else {
    h+=`<div class="mute">${lf?"Zuletzt "+ago(lf.end||lf.start)+" ("+fmtT(lf.start)+")"+(ns?" · nächste Seite: <b>"+(ns==="L"?"links":"rechts")+"</b>":""):"Noch keine Mahlzeit eingetragen"}</div>
    <div class="row" style="margin-top:10px"><button class="b L" onclick="feedStart('L')">${ns==="L"?"▶ ":""}Links starten</button><button class="b R" onclick="feedStart('R')">${ns==="R"?"▶ ":""}Rechts starten</button></div>
    <div class="row" style="margin-top:8px"><button class="b sm" onclick="sheetFeedManual()">+ nachtragen</button><button class="b sm" onclick="sheetBottle()">🍼 Fläschchen</button><button class="b sm" onclick="sheetPump()">🥛 Abpumpen</button></div>`;
  }
  h+=`</div>`;
  // Windel
  const dz=evsOf("diaper",sod); const wet=dz.filter(e=>e.wet).length, st=dz.filter(e=>e.stool).length;
  const ld=lastOf("diaper");
  h+=`<div class="card"><h2>WINDEL</h2><div class="mute">Heute: ${wet}× nass · ${st}× Stuhl${ld?" · zuletzt "+ago(ld.start):""}</div>
  <div class="row" style="margin-top:10px"><button class="b" onclick="quickDiaper(1,0)">💧 Nass</button><button class="b" onclick="sheetDiaper(1)">💩 Stuhl…</button><button class="b" onclick="sheetDiaper(0)">Mehr…</button></div></div>`;
  // Schlaf
  h+=`<div class="card"><h2>SCHLAF</h2>${S.active.sleep?`<div class="timer" id="sTot">${dur((now-S.active.sleep)/1000)}</div><div class="mute" style="text-align:center">schläft seit ${fmtT(S.active.sleep)}</div>`:`<div class="mute">Heute geschlafen: ${durMin(sleepSec(sod,now)/1000)}</div>`}
  <div class="row" style="margin-top:10px"><button class="b ${S.active.sleep?"pri":""}" onclick="sleepToggle()">${S.active.sleep?"☀️ Aufgewacht":"😴 Schläft ein"}</button><button class="b sm" onclick="sheetSleep()">+ nachtragen</button></div></div>`;
  // Tagesübersicht
  const feeds24=evsOf("feed",d24), bottles24=evsOf("bottle",d24);
  const fsec=feeds24.reduce((a,e)=>a+(e.L||0)+(e.R||0),0);
  const ml24=bottles24.reduce((a,e)=>a+(+e.ml||0),0);
  h+=`<div class="card"><h2>LETZTE 24 STUNDEN</h2><div class="stat">
    <div>Mahlzeiten<b>${feeds24.length+bottles24.length}</b><span class="mute">${feeds24.length}× Brust${bottles24.length?" · "+bottles24.length+"× Flasche":""}</span></div>
    <div>Stilldauer<b>${durMin(fsec)}</b><span class="mute">Ø ${feeds24.length?durMin(fsec/feeds24.length):"–"}</span></div>
    <div>Ø Abstand<b>${avgInterval(d24)}</b><span class="mute">Beginn zu Beginn</span></div>
    <div>Flasche<b>${ml24} ml</b><span class="mute">${bottles24.length}×</span></div></div></div>`;
  // Gewicht
  const g=lastGrowth("weight"); const bw=num(S.child.bw);
  if(g||bw){ h+=`<div class="card"><h2>GEWICHT</h2>`;
    if(g){ h+=`<div class="big">${g.weight} g</div><div class="mute">${fmtDs(g.start)} · ${pctText(pctOf("weight",g.weight,g.start))}</div>`;
      const ad=ageDays(g.start);
      if(bw && ad!=null && ad<=21){ const pc=(g.weight-bw)/bw*100;
        h+=`<div class="${pc<-10?"warnbox":"okbox"}">${pc>=0?"+":""}${pc.toFixed(1).replace(".",",")} % zum Geburtsgewicht (${bw} g)${pc<-10?" – mehr als 10 % Abnahme: bitte mit Hebamme/Kinderarzt besprechen.":""}</div>`; } }
    else h+=`<div class="mute">Geburtsgewicht ${bw} g</div>`;
    h+=`<button class="b sm" style="margin-top:8px" onclick="sheetGrowth()">+ Messung</button></div>`; }
  // Tägliche Gaben
  h+=dailyCard();
  // Nächste U
  const nu=nextU(); if(nu) h+=`<div class="card"><h2>NÄCHSTE VORSORGE</h2><b>${nu.n}</b> · ${nu.label}<div class="mute">${fmtDs(nu.from)} – ${fmtDs(nu.to)}</div></div>`;
  h+=`<div class="row"><button class="b sm" onclick="sheetTemp()">🌡️ Temperatur</button><button class="b sm" onclick="sheetMed()">💊 Medikament</button><button class="b sm" onclick="sheetNote()">📝 Notiz</button></div>`;
  return h;
}
function dailyCard(){ const k=dayKey(Date.now()); const d=S.daily[k]||{};
  if(!S.dailyItems.length) return "";
  return `<div class="card"><h2>HEUTE GEGEBEN</h2>${S.dailyItems.map((it,i)=>`<label style="display:flex;align-items:center;gap:10px;font-size:16px;color:var(--ink);margin:6px 0"><input type="checkbox" ${d[it]?"checked":""} onchange="tickDaily(${i},this.checked)"> ${esc(it)}${d[it]?` <span class="mute">${fmtT(d[it])}</span>`:""}</label>`).join("")}</div>`; }
function tickDaily(i,on){ const k=dayKey(Date.now()); S.daily[k]=S.daily[k]||{}; const it=S.dailyItems[i]; if(on) S.daily[k][it]=Date.now(); else delete S.daily[k][it]; save(); render(); }
function sleepSec(from,to){ let t=0; for(const e of S.events) if(e.type==="sleep"&&e.end){ const a=Math.max(e.start,from), b=Math.min(e.end,to); if(b>a) t+=b-a; }
  if(S.active.sleep){ const a=Math.max(S.active.sleep,from); if(to>a) t+=to-a; } return t; }
function avgInterval(from){ const f=S.events.filter(e=>(e.type==="feed"||e.type==="bottle")&&e.start>=from).map(e=>e.start);
  if(f.length<2) return "–"; return durMin((f[f.length-1]-f[0])/(f.length-1)/1000); }
function lastGrowth(field){ for(let i=S.events.length-1;i>=0;i--){ const e=S.events[i]; if(e.type==="growth"&&e[field]) return e; } return null; }
function quickDiaper(w,s){ addEvent({type:"diaper",start:Date.now(),wet:!!w,stool:!!s}); render(); }

function vVerlauf(){
  let h=`<div class="chips"><button class="chip ${!filter?"on":""}" onclick="setFilter('')">Alle</button>${Object.entries(TYPES).map(([k,t])=>`<button class="chip ${filter===k?"on":""}" onclick="setFilter('${k}')">${t.ic} ${t.n}</button>`).join("")}</div><div class="list">`;
  const evs=S.events.filter(e=>!filter||e.type===filter).slice().reverse();
  if(!evs.length) h+=`<p class="mute">Noch keine Einträge.</p>`;
  let last=""; let n=0;
  for(const e of evs){ if(++n>400) { h+=`<p class="mute">Ältere Einträge: siehe Export.</p>`; break; }
    const dk=dayKey(e.start); if(dk!==last){ last=dk; h+=`<div class="day">${fmtD(e.start)}${birthTs()?" · "+ageText(e.start):""}</div>`; }
    h+=`<div class="item" onclick="sheetEdit('${e.id}')"><span class="ic">${TYPES[e.type]?.ic||"•"}</span><span class="t">${fmtT(e.start)}</span><span class="d">${evDesc(e)}</span></div>`; }
  return h+`</div>`;
}
function setFilter(f){ filter=f; render(); }

function vWachstum(){
  let h=setupHint();
  const bc=birthClass(), c=S.child;
  h+=`<div class="card"><h2>BEI GEBURT (VOIGT)</h2>`;
  if(!c.sex||!c.gaW) h+=`<div class="mute">Geschlecht und SSW fehlen.</div>`;
  else if(bc.src==="fehlt") h+=`<div class="mute">Für ${c.gaW} vollendete SSW sind die Voigt-Tabellen noch nicht hinterlegt (enthalten: 23–${VOIGT_MAX_SSW} SSW).</div>`;
  else h+=`<table><tr><td>Gewicht</td><td>${c.bw?c.bw+" g":"–"}</td><td>${bc.w?pctText(bc.w):"–"}</td></tr><tr><td>Länge</td><td>${c.bl?c.bl+" cm":"–"}</td><td>${bc.l?pctText(bc.l):"–"}</td></tr></table>${bc.cls?`<div class="okbox">Einordnung: <b>${bc.cls}</b> bei ${c.gaW}+${c.gaD||0} SSW</div>`:""}`;
  h+=`</div>`;
  h+=`<div class="chips" style="margin-bottom:8px">${[[3,"0–3 Mo"],[6,"0–6 Mo"],[12,"0–12 Mo"],[24,"0–2 J"],[36,"0–3 J"]].map(([r,l])=>`<button class="chip ${growthRange===r?"on":""}" onclick="growthRange=${r};render()">${l}</button>`).join("")}</div>`;
  for(const [kind,field,title,unit] of [["weight","weight","GEWICHT (Kromeyer-Hauschild)","kg"],["length","length","LÄNGE (Kromeyer-Hauschild)","cm"],["hc","hc","KOPFUMFANG (WHO)","cm"]])
    h+=`<div class="card"><h2>${title}</h2>${chart(kind,field,unit)}</div>`;
  if(isPreterm()) h+=`<p class="mute">Frühgeborenes: Kurven nach korrigiertem Alter (bis 2 Jahre). Vor dem errechneten Termin werden für Gewicht und Länge die Voigt-Werte genutzt.</p>`;
  const ms=S.events.filter(e=>e.type==="growth").slice().reverse();
  h+=`<div class="card"><h2>MESSUNGEN</h2><button class="b pri" style="width:100%" onclick="sheetGrowth()">+ Neue Messung</button>`;
  if(ms.length){ h+=`<table style="margin-top:10px"><tr><th>Datum</th><th>Gewicht</th><th>Länge</th><th>KU</th></tr>`+ms.map(e=>`<tr onclick="sheetEdit('${e.id}')"><td>${fmtDs(e.start)}<br><span class="mute">${ageText(e.start)}</span></td><td>${e.weight?e.weight+" g<br>"+pctText(pctOf("weight",e.weight,e.start)):"–"}</td><td>${e.length?e.length+"<br>"+pctText(pctOf("length",e.length,e.start)):"–"}</td><td>${e.hc?e.hc+"<br>"+pctText(pctOf("hc",e.hc,e.start)):"–"}</td></tr>`).join("")+`</table>`; }
  h+=`</div><p class="mute">Quellen: Kromeyer-Hauschild et al., Monatsschr Kinderheilkd 2001; Voigt et al. (Frühgeborenenkorrektur, 23–39 SSW); Kopfumfang WHO Child Growth Standards 2006 (KH enthält keinen Kopfumfang). LMS-Parameter aus dem R-Paket childsds.</p>`;
  return h;
}
function chart(kind, field, unit){
  const key=refKey(kind); if(!key) return `<div class="mute">Geschlecht fehlt.</div>`;
  const W=340,H=230,pl=34,pr=26,pt=8,pb=24;
  const pre=isPreterm(); const xmin = (kind!=="hc" && pre) ? Math.max(-(280-gaTotalDays())/365.25*12, -4) : 0; // Monate
  const xmax=growthRange;
  const pts=[]; for(let i=0;i<=80;i++){ const xm=xmin+(xmax-xmin)*i/80; pts.push(xm); }
  const curves={}; let ymin=Infinity,ymax=-Infinity;
  for(const p of [3,10,50,90,97]){ curves[p]=[]; for(const xm of pts){ const l=lmsAt(key,xm/12); if(!l) continue; const y=yOf(Z[p],l); if(!isFinite(y)) continue; curves[p].push([xm,y]); ymin=Math.min(ymin,y); ymax=Math.max(ymax,y);} }
  const meas=S.events.filter(e=>e.type==="growth"&&e[field]).map(e=>{ const a=refAgeYears(e.start); return [a*12, kind==="weight"?e[field]/1000:+e[field], e]; }).filter(m=>m[0]>=xmin-0.01&&m[0]<=xmax+0.01);
  if(kind==="weight"&&num(S.child.bw)){ const a=refAgeYears(birthTs()); if(a!=null&&a*12>=xmin-0.01) meas.unshift([a*12,num(S.child.bw)/1000]); }
  if(kind==="length"&&num(S.child.bl)){ const a=refAgeYears(birthTs()); if(a!=null&&a*12>=xmin-0.01) meas.unshift([a*12,num(S.child.bl)]); }
  if(kind==="hc"&&num(S.child.bhc)){ const a=refAgeYears(birthTs()); if(a!=null&&a>=0) meas.unshift([a*12,num(S.child.bhc)]); }
  for(const m of meas){ ymin=Math.min(ymin,m[1]); ymax=Math.max(ymax,m[1]); }
  if(!isFinite(ymin)) return `<div class="mute">Keine Referenzdaten in diesem Bereich.</div>`;
  const span=ymax-ymin; ymin-=span*0.04; ymax+=span*0.04;
  const X=x=>pl+(x-xmin)/(xmax-xmin)*(W-pl-pr), Y=y=>pt+(1-(y-ymin)/(ymax-ymin))*(H-pt-pb);
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block">`;
  const ystep = niceStep((ymax-ymin)/6);
  for(let y=Math.ceil(ymin/ystep)*ystep;y<=ymax;y+=ystep){ s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(y)}" y2="${Y(y)}" stroke="var(--line)"/><text x="${pl-4}" y="${Y(y)+3}" text-anchor="end">${+y.toFixed(1)}</text>`; }
  const xstep = xmax<=3?0.5: xmax<=6?1: xmax<=12?2: xmax<=24?3:6;
  for(let x=Math.ceil(xmin/xstep)*xstep;x<=xmax+1e-9;x+=xstep){ s+=`<line x1="${X(x)}" x2="${X(x)}" y1="${pt}" y2="${H-pb}" stroke="var(--line)"/><text x="${X(x)}" y="${H-pb+13}" text-anchor="middle">${+x.toFixed(1)}</text>`; }
  if(xmin<0) s+=`<line x1="${X(0)}" x2="${X(0)}" y1="${pt}" y2="${H-pb}" stroke="var(--mute)" stroke-dasharray="3 3"/>`;
  s+=`<text x="${W-pr}" y="${H-2}" text-anchor="end">Monate${pre&&kind!=="hc"?" (korr.)":pre?" (korr.)":""}</text><text x="2" y="${pt+8}">${unit}</text>`;
  for(const p of [3,10,50,90,97]){ const c=curves[p]; if(c.length<2) continue;
    s+=`<polyline fill="none" stroke="${p===50?"var(--acc)":"var(--mute)"}" stroke-width="${p===50?1.6:1}" ${p===10||p===90?'stroke-dasharray="4 3"':""} points="${c.map(q=>X(q[0]).toFixed(1)+","+Y(q[1]).toFixed(1)).join(" ")}"/>`;
    const lp=c[c.length-1]; s+=`<text x="${W-pr+2}" y="${Y(lp[1])+3}">${p}</text>`; }
  if(meas.length>1) s+=`<polyline fill="none" stroke="var(--acc2)" stroke-width="2" points="${meas.map(m=>X(m[0]).toFixed(1)+","+Y(m[1]).toFixed(1)).join(" ")}"/>`;
  for(const m of meas) s+=`<circle cx="${X(m[0])}" cy="${Y(m[1])}" r="3.5" fill="var(--acc2)"/>`;
  return s+`</svg>`;
}
function niceStep(r){ const p=Math.pow(10,Math.floor(Math.log10(r))); const f=r/p; return (f<1.5?1:f<3?2:f<7?5:10)*p; }

function vStatistik(){
  const days=[]; const today=startOfDay(Date.now());
  for(let i=6;i>=0;i--){ const a=today-i*864e5, b=a+864e5; const f=evsOf("feed",a,b), bo=evsOf("bottle",a,b), dz=evsOf("diaper",a,b);
    days.push({lab:new Date(a).toLocaleDateString("de-DE",{weekday:"short"}), meals:f.length+bo.length, fmin:f.reduce((s,e)=>s+(e.L||0)+(e.R||0),0)/60,
      L:f.reduce((s,e)=>s+(e.L||0),0)/60, R:f.reduce((s,e)=>s+(e.R||0),0)/60, ml:bo.reduce((s,e)=>s+(+e.ml||0),0),
      wet:dz.filter(e=>e.wet).length, stool:dz.filter(e=>e.stool).length, sleep:sleepSec(a,Math.min(b,Date.now()))/36e5}); }
  const tot=k=>days.reduce((s,d)=>s+d[k],0);
  let h=`<div class="card"><h2>MAHLZEITEN / TAG</h2>${bars(days,"meals")}</div>
  <div class="card"><h2>STILLDAUER / TAG (MIN) · links / rechts</h2>${bars(days,["L","R"])}<div class="mute">7 Tage: links ${Math.round(tot("L"))} min · rechts ${Math.round(tot("R"))} min</div></div>
  <div class="card"><h2>WINDELN / TAG · nass / Stuhl</h2>${bars(days,["wet","stool"])}</div>
  <div class="card"><h2>SCHLAF / TAG (STD)</h2>${bars(days,"sleep",1)}</div>`;
  if(tot("ml")) h+=`<div class="card"><h2>FLÄSCHCHEN / TAG (ML)</h2>${bars(days,"ml")}</div>`;
  const f30=evsOf("feed",Date.now()-30*864e5);
  h+=`<div class="card"><h2>STILLEN, LETZTE 30 TAGE</h2><div class="stat"><div>Mahlzeiten<b>${f30.length}</b></div><div>Ø Dauer<b>${f30.length?durMin(f30.reduce((s,e)=>s+(e.L||0)+(e.R||0),0)/f30.length):"–"}</b></div></div></div>`;
  return h;
}
function bars(days,keys,dec){ keys=Array.isArray(keys)?keys:[keys]; const W=340,H=130,pb=20,pt=14; const bw=(W-10)/days.length;
  const max=Math.max(1,...days.map(d=>keys.reduce((s,k)=>s+d[k],0)));
  const cols=keys.length>1?["var(--l)","var(--r)"]:["var(--acc)"];
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%">`;
  days.forEach((d,i)=>{ let y=H-pb; keys.forEach((k,j)=>{ const h=(d[k]/max)*(H-pb-pt); y-=h; s+=`<rect x="${5+i*bw+bw*0.15}" y="${y}" width="${bw*0.7}" height="${Math.max(0,h)}" rx="3" fill="${cols[j]}"/>`; });
    const t=keys.reduce((s,k)=>s+d[k],0); s+=`<text x="${5+i*bw+bw/2}" y="${y-3}" text-anchor="middle">${dec?t.toFixed(1).replace(".",","):Math.round(t)}</text><text x="${5+i*bw+bw/2}" y="${H-5}" text-anchor="middle">${d.lab}</text>`; });
  return s+`</svg>`; }

/* ===== U-Untersuchungen (Kinder-Richtlinie) ===== */
const US=[["U1","direkt nach der Geburt",0,0,"d"],["U2","3.–10. Lebenstag",2,9,"d"],["U3","4.–5. Lebenswoche",21,34,"d"],["U4","3.–4. Lebensmonat",2,4,"m"],
 ["U5","6.–7. Lebensmonat",5,7,"m"],["U6","10.–12. Lebensmonat",9,12,"m"],["U7","21.–24. Lebensmonat",20,24,"m"],["U7a","34.–36. Lebensmonat",33,36,"m"],
 ["U8","46.–48. Lebensmonat",45,48,"m"],["U9","60.–64. Lebensmonat",59,64,"m"]];
function addM(ts,m){ const d=new Date(ts); const day=d.getDate(); d.setMonth(d.getMonth()+m); if(d.getDate()<day) d.setDate(0); return d.getTime(); }
function uList(){ const b=birthTs(); if(b==null) return []; const b0=startOfDay(b);
  return US.map(([n,label,a,z,u])=>({n,label,from:u==="d"?b0+a*864e5:addM(b0,a),to:u==="d"?b0+z*864e5+864e5-1:addM(b0,z)-1})); }
function nextU(){ const now=Date.now(); return uList().find(u=>!S.uDone[u.n]&&u.to>=now)||null; }

function vMehr(){
  const c=S.child; let h=`<div class="card"><h2>KIND</h2>
  <label>Name</label><input id="cName" value="${esc(c.name)}">
  <label>Geschlecht</label><select id="cSex"><option value="">–</option><option value="female" ${c.sex==="female"?"selected":""}>Mädchen</option><option value="male" ${c.sex==="male"?"selected":""}>Junge</option></select>
  <label>Geburt (Datum + Uhrzeit)</label><input id="cBirth" type="datetime-local" value="${esc(c.birth)}">
  <label>Schwangerschaftswoche bei Geburt (vollendete Wochen + Tage)</label><div class="row"><input id="cGaW" type="number" inputmode="numeric" min="22" max="44" value="${esc(c.gaW)}"><input id="cGaD" type="number" inputmode="numeric" min="0" max="6" value="${esc(c.gaD)}"></div>
  <label>Geburtsgewicht (g) · Länge (cm) · Kopfumfang (cm)</label><div class="row"><input id="cBw" inputmode="decimal" value="${esc(c.bw)}" placeholder="g"><input id="cBl" inputmode="decimal" value="${esc(c.bl)}" placeholder="cm"><input id="cBhc" inputmode="decimal" value="${esc(c.bhc)}" placeholder="KU"></div>
  <button class="b pri" style="width:100%;margin-top:12px" onclick="saveChild()">Speichern</button></div>`;
  // U
  const ul=uList(); const now=Date.now();
  h+=`<div class="card"><h2>VORSORGE (U-UNTERSUCHUNGEN)</h2>`+(ul.length?ul.map(u=>{ const d=S.uDone[u.n]; const st=d?`<span class="pill done">erledigt ${fmtDs(d)}</span>`: now>=u.from&&now<=u.to?`<span class="pill now">jetzt fällig</span>`: now>u.to&&u.n!=="U1"?`<span class="pill late">überfällig?</span>`:"";
    return `<div class="u"><span class="n">${u.n}</span><span class="w">${u.label}<br><span class="mute">${fmtDs(u.from)} – ${fmtDs(u.to)}</span> ${st}</span><input type="checkbox" ${d?"checked":""} onchange="uTick('${u.n}',this.checked)"></div>`; }).join("")+`<p class="mute">Zeiträume laut Kinder-Richtlinie des G-BA; es gelten zusätzlich Toleranzzeiten. Termin bitte mit der Praxis abstimmen.</p>`:`<div class="mute">Geburtsdatum fehlt.</div>`)+`</div>`;
  // Impfungen
  const vs=S.events.filter(e=>e.type==="vacc");
  h+=`<div class="card"><h2>IMPFUNGEN</h2>${vs.length?vs.map(e=>`<div class="item" onclick="sheetEdit('${e.id}')"><span class="t" style="width:80px">${fmtDs(e.start)}</span><span class="d">${esc(e.name)}</span></div>`).join(""):`<div class="mute">Noch keine eingetragen. Maßgeblich ist der Impfpass bzw. der aktuelle STIKO-Kalender.</div>`}<button class="b sm" style="margin-top:8px" onclick="sheetVacc()">+ Impfung</button></div>`;
  // tägliche Gaben
  h+=`<div class="card"><h2>TÄGLICHE GABEN (HÄKCHEN)</h2>${S.dailyItems.map((it,i)=>`<div class="u"><span class="w">${esc(it)}</span><button class="b sm" onclick="delDaily(${i})">entfernen</button></div>`).join("")}
  <div class="row" style="margin-top:8px"><input id="newDaily" placeholder="z. B. Fluorid"><button class="b sm" style="flex:0 0 auto" onclick="addDaily()">+ hinzufügen</button></div></div>`;
  // Meilensteine
  const ms=S.events.filter(e=>e.type==="note"&&e.milestone);
  h+=`<div class="card"><h2>MEILENSTEINE</h2>${ms.length?ms.map(e=>`<div class="item" onclick="sheetEdit('${e.id}')"><span class="t" style="width:80px">${fmtDs(e.start)}</span><span class="d">${esc(e.text)}</span></div>`).join(""):`<div class="mute">Noch keine.</div>`}<button class="b sm" style="margin-top:8px" onclick="sheetNote(true)">+ Meilenstein</button></div>`;
  // Daten
  h+=connCard();
  h+=`<div class="card"><h2>DATEN</h2><div class="mute">${S.events.length} Einträge · letzte Sicherung: ${S.lastExport?fmtD(S.lastExport)+" "+fmtT(S.lastExport):"noch nie"}<br>Alles wird in Home Assistant gespeichert (Teil jeder HA-Sicherung) und auf allen Geräten abgeglichen. Ohne Verbindung bleibt es auf diesem Gerät und wird später nachgereicht.</div>
  <div class="row" style="margin-top:10px"><button class="b" onclick="exportJSON()">💾 Sicherung speichern</button><button class="b" onclick="$('#importFile').click()">📂 Sicherung laden</button></div>
  <div class="row" style="margin-top:8px"><button class="b sm" onclick="exportCSV()">CSV-Export (Excel)</button><button class="b sm danger" onclick="wipe()">Alles löschen</button></div></div>
  <p class="mute">Perzentilen und Hinweise ersetzen keine ärztliche Beurteilung.</p>`;
  return h;
}
function saveChild(){ const c=S.child; c.name=$("#cName").value.trim(); c.sex=$("#cSex").value; c.birth=$("#cBirth").value;
  c.gaW=$("#cGaW").value; c.gaD=$("#cGaD").value; c.bw=$("#cBw").value.trim(); c.bl=$("#cBl").value.trim().replace(",","."); c.bhc=$("#cBhc").value.trim().replace(",",".");
  save(); render(); }
function uTick(n,on){ if(on) S.uDone[n]=Date.now(); else delete S.uDone[n]; save(); render(); }
function addDaily(){ const v=$("#newDaily").value.trim(); if(v&&!S.dailyItems.includes(v)){ S.dailyItems.push(v); save(); render(); } }
function delDaily(i){ S.dailyItems.splice(i,1); save(); render(); }

/* ===== Export / Import ===== */
function download(name, text, type){ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000); }
function exportJSON(){ S.lastExport=Date.now(); save(); download("baby-tagebuch-"+dayKey(Date.now())+".json", JSON.stringify(S,null,1), "application/json"); render(); }
function exportCSV(){ const rows=[["Datum","Uhrzeit","Typ","Details","Ende","Links_s","Rechts_s","ml","Gewicht_g","Laenge_cm","KU_cm","Temp_C"]];
  for(const e of S.events) rows.push([fmtDs(e.start),fmtT(e.start),TYPES[e.type]?.n||e.type,evDesc(e).replace(/<[^>]+>/g,""),e.end?fmtT(e.end):"",e.L||"",e.R||"",e.ml||((+e.mlL||0)+(+e.mlR||0))||"",e.weight||"",e.length||"",e.hc||"",e.c||""]);
  download("baby-tagebuch-"+dayKey(Date.now())+".csv","﻿"+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\n"),"text/csv"); }
$("#importFile").addEventListener("change", ev=>{ const f=ev.target.files[0]; if(!f) return; const r=new FileReader();
  r.onload=()=>{ try{ const d=JSON.parse(r.result); if(!d||!Array.isArray(d.events)) throw 0;
      if(confirm("Sicherung mit "+d.events.length+" Einträgen laden? Die aktuellen Daten werden ersetzt.")){ S=Object.assign(DEF(),d); save(); render(); } }
    catch(e){ alert("Die Datei ist keine gültige Sicherung."); } ev.target.value=""; }; r.readAsText(f); });
function wipe(){ if(confirm("Wirklich ALLE Daten löschen – auf allen Geräten?") && confirm("Sicher? Das lässt sich nicht rückgängig machen (außer mit einer Sicherung).")){ S=DEF(); save(); render(); } }

/* ===== Eingabe-Dialoge ===== */
function openSheet(html){ $("#sheet").innerHTML=html; $("#sheetBg").classList.add("open"); }
function closeSheet(){ $("#sheetBg").classList.remove("open"); }
$("#sheetBg").addEventListener("click",e=>{ if(e.target.id==="sheetBg") closeSheet(); });
const timeField = (ts,id="fStart",lab="Zeitpunkt") => `<label>${lab}</label><input id="${id}" type="datetime-local" value="${toInput(ts)}">`;
const btns = (saveFn, delId) => `<div class="row" style="margin-top:14px">${delId?`<button class="b danger" onclick="delEvent('${delId}')">Löschen</button>`:""}<button class="b" onclick="closeSheet()">Abbrechen</button><button class="b pri" onclick="${saveFn}">Speichern</button></div>`;
function readStart(){ const t=fromInput($("#fStart").value); if(!isFinite(t)){ alert("Bitte Zeitpunkt angeben."); return null; } return t; }

function formFields(e){
  switch(e.type){
    case "feed": return timeField(e.start,"fStart","Beginn")+`<label>Minuten links · rechts</label><div class="row"><input id="fL" inputmode="decimal" value="${e.L?+(e.L/60).toFixed(1):""}"><input id="fR" inputmode="decimal" value="${e.R?+(e.R/60).toFixed(1):""}"></div>
      <label>Zuletzt angelegt</label><select id="fLast"><option value="L" ${e.last==="L"?"selected":""}>links</option><option value="R" ${e.last==="R"?"selected":""}>rechts</option></select><label>Notiz</label><input id="fNote" value="${esc(e.note)}">`;
    case "bottle": return timeField(e.start)+`<label>Menge (ml)</label><input id="fMl" inputmode="numeric" value="${esc(e.ml)}"><label>Inhalt</label><select id="fKind">${["Muttermilch","Pre-Nahrung","1er-Nahrung","Sonstiges"].map(k=>`<option ${e.kind===k?"selected":""}>${k}</option>`).join("")}</select>`;
    case "pump": return timeField(e.start)+`<label>ml links · rechts</label><div class="row"><input id="fMlL" inputmode="numeric" value="${esc(e.mlL)}"><input id="fMlR" inputmode="numeric" value="${esc(e.mlR)}"></div>`;
    case "diaper": return timeField(e.start)+`<label style="display:flex;gap:10px;align-items:center;color:var(--ink);font-size:16px"><input type="checkbox" id="fWet" ${e.wet?"checked":""}> nass</label><label style="display:flex;gap:10px;align-items:center;color:var(--ink);font-size:16px"><input type="checkbox" id="fStool" ${e.stool?"checked":""}> Stuhl</label>
      <label>Stuhlfarbe</label><select id="fColor" onchange="colorAlert()"><option value="">–</option>${Object.entries(STOOL).map(([k,v])=>`<option value="${k}" ${e.color===k?"selected":""}>${v}</option>`).join("")}</select><div id="colorAlert"></div>`;
    case "sleep": return timeField(e.start,"fStart","Eingeschlafen")+timeField(e.end||Date.now(),"fEnd","Aufgewacht");
    case "growth": return timeField(e.start,"fStart","Datum")+`<label>Gewicht (g)</label><input id="fW" inputmode="numeric" value="${esc(e.weight)}"><label>Länge (cm)</label><input id="fLen" inputmode="decimal" value="${esc(e.length)}"><label>Kopfumfang (cm)</label><input id="fHc" inputmode="decimal" value="${esc(e.hc)}">`;
    case "temp": return timeField(e.start)+`<label>Temperatur (°C)</label><input id="fC" inputmode="decimal" value="${esc(e.c)}"><label>Messart</label><select id="fMeth">${["rektal","axillär","Ohr","Stirn"].map(k=>`<option ${e.method===k?"selected":""}>${k}</option>`).join("")}</select>`;
    case "med": return timeField(e.start)+`<label>Medikament</label><input id="fName" value="${esc(e.name)}"><label>Dosis</label><input id="fDose" value="${esc(e.dose)}">`;
    case "vacc": return timeField(e.start,"fStart","Datum")+`<label>Impfung / Impfstoff</label><input id="fName" value="${esc(e.name)}">`;
    case "note": return timeField(e.start)+`<label>Text</label><textarea id="fText" rows="3">${esc(e.text)}</textarea><label style="display:flex;gap:10px;align-items:center;color:var(--ink);font-size:16px"><input type="checkbox" id="fMile" ${e.milestone?"checked":""}> Meilenstein</label>`;
  }
}
function readForm(e){
  const t=readStart(); if(t==null) return false; e.start=t;
  const v=id=>$("#"+id).value.trim();
  switch(e.type){
    case "feed": { const L=num(v("fL"))||0, R=num(v("fR"))||0; e.L=Math.round(L*60); e.R=Math.round(R*60); e.end=e.start+(e.L+e.R)*1000; e.last=v("fLast"); e.note=v("fNote"); break; }
    case "bottle": e.ml=num(v("fMl")); e.kind=v("fKind"); break;
    case "pump": e.mlL=num(v("fMlL")); e.mlR=num(v("fMlR")); break;
    case "diaper": e.wet=$("#fWet").checked; e.stool=$("#fStool").checked; e.color=v("fColor"); if(e.color) e.stool=true; break;
    case "sleep": { const en=fromInput(v("fEnd")); if(!isFinite(en)||en<=e.start){ alert("Ende muss nach dem Beginn liegen."); return false; } e.end=en; break; }
    case "growth": e.weight=num(v("fW")); e.length=num(v("fLen")); e.hc=num(v("fHc"));
      if(!e.weight&&!e.length&&!e.hc){ alert("Bitte mindestens einen Wert eintragen."); return false; }
      if(e.weight&&e.weight<100){ if(confirm("Gewicht in kg eingegeben? In Gramm umrechnen?")) e.weight=Math.round(e.weight*1000); } break;
    case "temp": e.c=num(v("fC")); e.method=v("fMeth"); if(e.c==null){ alert("Bitte Temperatur eintragen."); return false; } break;
    case "med": e.name=v("fName"); e.dose=v("fDose"); if(!e.name){ alert("Bitte Medikament eintragen."); return false; } break;
    case "vacc": e.name=v("fName"); if(!e.name){ alert("Bitte Impfung eintragen."); return false; } break;
    case "note": e.text=v("fText"); e.milestone=$("#fMile").checked; if(!e.text){ alert("Bitte Text eintragen."); return false; } break;
  }
  return true;
}
let draft=null;
function sheetNew(type, init={}, title){ draft=Object.assign({type,start:Date.now()},init);
  openSheet(`<h3>${TYPES[type].ic} ${title||TYPES[type].n}</h3>${formFields(draft)}${btns("saveDraft()")}`); if(type==="diaper") colorAlert(); }
function saveDraft(){ if(!readForm(draft)) return; const e=draft; addEvent(e); closeSheet(); render(); afterSave(e); }
function afterSave(e){
  if(e.type==="temp" && e.c>=38){ const ad=ageDays(e.start); setTimeout(()=>alert(ad!=null&&ad<91?"Fieber (≥ 38 °C) bei einem Säugling unter 3 Monaten: bitte umgehend ärztlich abklären.":"Fieber ≥ 38 °C eingetragen. Bei Trinkschwäche, Teilnahmslosigkeit oder Sorgen ärztlich abklären."),50); }
  if(e.type==="diaper" && STOOL_ALERT[e.color]) setTimeout(()=>alert(STOOL_ALERT[e.color]),50);
}
function colorAlert(){ const el=$("#colorAlert"); if(!el) return; const c=$("#fColor").value; el.innerHTML=STOOL_ALERT[c]?`<div class="warnbox">${STOOL_ALERT[c]}</div>`:""; }
function sheetEdit(id){ const e=S.events.find(x=>x.id===id); if(!e) return; draft=JSON.parse(JSON.stringify(e));
  openSheet(`<h3>${TYPES[e.type]?.ic||""} ${TYPES[e.type]?.n||e.type} bearbeiten</h3>${formFields(draft)}${btns("saveEdit()",id)}`); if(e.type==="diaper") colorAlert(); }
function saveEdit(){ if(!readForm(draft)) return; const i=S.events.findIndex(x=>x.id===draft.id); if(i>=0) S.events[i]=draft; S.events.sort((a,b)=>a.start-b.start); save(); closeSheet(); render(); afterSave(draft); }
function delEvent(id){ if(!confirm("Eintrag löschen?")) return; S.events=S.events.filter(e=>e.id!==id); save(); closeSheet(); render(); }
const sheetFeedManual=()=>sheetNew("feed",{start:Date.now()-15*60000,last:nextSide()==="L"?"R":"L"},"Stillen nachtragen");
const sheetBottle=()=>sheetNew("bottle",{kind:"Muttermilch"});
const sheetPump=()=>sheetNew("pump");
const sheetDiaper=s=>sheetNew("diaper",{wet:!s,stool:!!s});
const sheetSleep=()=>sheetNew("sleep",{start:Date.now()-60*60000,end:Date.now()},"Schlaf nachtragen");
const sheetGrowth=()=>sheetNew("growth");
const sheetTemp=()=>sheetNew("temp",{method:"rektal"});
const sheetMed=()=>sheetNew("med");
const sheetVacc=()=>sheetNew("vacc");
const sheetNote=m=>sheetNew("note",{milestone:!!m},m?"Meilenstein":"Notiz");

/* ===== Start ===== */
function go(v){ view=v; window.scrollTo(0,0); render(); }
document.querySelectorAll("nav button").forEach(b=>b.addEventListener("click",()=>go(b.dataset.v)));
$("#nightBtn").addEventListener("click",()=>{ S.settings.night=!S.settings.night; save(); render(); });
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"){ scheduleSync(0); render(); } });
window.addEventListener("online",()=>scheduleSync(0));
window.__babyOnHass = () => { subscribe(); if(online!==true) scheduleSync(0); };
setInterval(()=>{ if(document.visibilityState!=="hidden") sync(); }, (window.__babyApi&&window.__babyApi.poll)||60000);
load(); render(); updSync(); subscribe(); sync();
