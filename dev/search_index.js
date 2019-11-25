var documenterSearchIndex = {"docs":
[{"location":"#ShapeFromShading.jl-1","page":"Home","title":"ShapeFromShading.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"The following documents the functionality currently available in ShapeFormShading.jl.","category":"page"},{"location":"#Synthetic-data-generation:-1","page":"Home","title":"Synthetic data generation:","text":"","category":"section"},{"location":"#Normal-Integration:-1","page":"Home","title":"Normal Integration:","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Frankot(::AbstractArray, ::AbstractArray)","category":"page"},{"location":"#ShapeFromShading.Frankot-Tuple{AbstractArray,AbstractArray}","page":"Home","title":"ShapeFromShading.Frankot","text":"Frankot()\n\nDefines the Frankot integrator which contians the Frankot-Chellappa method of integration. The Frankot-Chellappa method is a fast, reliable method for integration surface normals while enforcing integrability using Fourier methods.\n\nOutput\n\nFrankot() returns a Frankot integrator which can then be called to run the Frankot-Chellappa method on a gradient field.\n\nDetails\n\nFrankot-Chellappa method uses Fourier methods to attempt to solve the Poission equation nabla^2z = partial_up + partial_vq. By taking the Fourier transform of both sides we get:\n\n(omega^2_u + omega^2_v)hatz(omega_u omega_v) = imath omega_uhatp\n(omega_u omega_v) + imath omega_vhatq(omega_u omega_v)\n\nBy rearranging the above equation we arrive at an equation for hatz;\n\nhatz(omega_u omega_v) = fracomega_uhatp(omega_u omega_v) +\nomega_vhatq(omega_u omega_v)imath(omega^2_u + omega^2_v)\n\nFrom which the final surface can be found by taking the inverse Fourier transform of hatz.\n\nDue to the way (omega_u omega_v) is defined the algorithm works best when the input dimensions are odd in length. To accommodate this the integrator will pad the edge of the inputs if they are even before running the algorithm. This padding will be removed before returning a value hence output size will be unaffected.\n\nParameters\n\nFrankot integrator take no parameters.\n\nExample\n\nThe following example demonstrates  the use of the Frankot integrator.\n\nusing ShapeFromShading, Makie\n\n# Generate synthetic gradients\np, q = synthetic_gradient(SynthSphere(), radius = 38, img_size = 151)\n\n# Create a Frankot() integrator\nfrankot = Frankot()\n\n# Calculate the heightmap from the gradients\nZ = frankot(p, q)\n\n# Normalize to maximum of 1 (not necessary but makes displaying easier)\nZ = Z./maximum(Z)\n\n# Display using Makie (Note: Makie can often take several minutes first time)\nr = 0.0:0.1:4\nsurface(r, r, Z)\n\nReference\n\n[1] R. T. Frankot and R. Chellappa, \"A method for enforcing integrability in shape from shading algorithms,\" in IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. 10, no. 4, pp. 439-451, July 1988. doi: 10.1109/34.3909\n\n\n\n\n\n","category":"method"},{"location":"#","page":"Home","title":"Home","text":"Path(::AbstractArray, ::AbstractArray)","category":"page"},{"location":"#ShapeFromShading.Path-Tuple{AbstractArray,AbstractArray}","page":"Home","title":"ShapeFromShading.Path","text":"Path()\n\nCreates a Path() integrator which utilises the average of two path integrals along varying paths. Each path integral reconstructs the surface with accumulating error along the path, hence averaging two different paths can minimise this error, although the method still suffers if the gradient field is not integrable at some points.\n\nOutput\n\nPath() returns a Path integrator which can then be called to integrate a gradient field.\n\nDetails\n\nUnder the assumption that the surface normals are approximately integrable everywhere (fracpartial ppartial yapproxfracpartial qpartial x), then surface can be reconstructed using the path integral defined as:\n\nz(xy)=oint_cleft(fracpartial zpartial xfracpartial zpartial yright)cdot dl\n\nWhich can be broken into two integrals representing the value at each point on the surface as shown below for a path which integrates along the first column then along the row.\n\nz(uv)=int_0^vfracpartial zpartial y(0y)dy + int_0^ufracpartial zpartial x(xv)dx\n\nThe second path used in the algorithm is simply the transpose of the first, integrating along the first row then down the column represented mathematically as:\n\nz(uv)=int_0^ufracpartial zpartial x(x0)dx + int_0^vfracpartial zpartial y(uy)dy\n\nThe algorithm can be written, then discretised as shown below:\n\nbegingathered\nz(uv)=frac12left(int_0^vfracpartial zpartial y(0y)dy + int_0^ufracpartial zpartial x(xv)dx + int_0^ufracpartial zpartial x(x0)dx + int_0^vfracpartial zpartial y(uy)dyright)\nz(uv)=frac12left(sum_i=0^vq(0i) + sum_j=0^up(jv) + sum_j=0^up(j0) + sum_i=0^vq(ui)right)\nz(uv)=frac12left(sum_i=0^v(q(0i) + q(ui)) + sum_j=0^u(p(j0) + p(jv))right)\nendgathered\n\nIt is important to note as mentioned above if there are non-integrable points in the normal field then artefacts can appear in the reconstruction. This is seen in the example below where the otherwise smooth sphere appears \"spiky\". This can be corrected post reconstruction by smoothing but ideally a different integrator should be used.\n\nParameters\n\nPath integrator take no parameters.\n\nExample\n\nThe following example demonstrates the use of the Path integrator.\n\nusing ShapeFromShading, Makie\n\n# Generate synthetic gradients\np, q = synthetic_gradient(SynthSphere(), radius = 38, img_size = 151)\n\n# Create a Path() integrator\npath = Path()\n\n# Calculate the heightmap from the gradients\nZ = path(p, q)\n\n# Normalize to maximum of 1 (not necessary but makes displaying easier)\nZ = Z./maximum(Z)\n\n# Display using Makie (Note: Makie can often take several minutes first time)\nr = 0.0:0.1:4\nsurface(r, r, Z)\n\nReference\n\n[1] D. Forsyth and J. Ponce, Computer vision: a modern approach. Upper Saddle River, N.J: Prentice Hall, 2003, pp. 84-86.\n\n\n\n\n\n","category":"method"},{"location":"#","page":"Home","title":"Home","text":"SplitPath(::AbstractArray, ::AbstractArray)","category":"page"},{"location":"#ShapeFromShading.SplitPath-Tuple{AbstractArray,AbstractArray}","page":"Home","title":"ShapeFromShading.SplitPath","text":"SplitPath()\n\nCreates a SplitPath() integrator which utilizes the average of two path integrals along varying paths averaging the value at each step. Each path integral reconstructs the surface with accumlating error along the path, hence averaging two different paths at each step reduces the global error at the cost of local error, although the method still suffers if the gradient field is not integrable at some points it does less so the Path() from which it extends.\n\nOutput\n\nSplitPath() returns a SplitPath integrator which can then be called to integrate a gradient field.\n\nDetails\n\nUnder the assumption that the surface normals are approximately integrable everywhere (fracpartial ppartial yapproxfracpartial qpartial x), then surface can be reconstructed using the path integral defined as:\n\nz(xy)=oint_cleft(fracpartial zpartial xfracpartial zpartial yright)cdot dl\n\nBy expanding on this principle and the discreate summation from Path() we can arrive at the discreate expresion for the value at each point, assuming all values prior to that point have been calculated, as follows:\n\nz_uv = frac12(z_u-1v+p_u-1v+z_uv-1+q_uv-1)\n\nAs with other similar methods (see Horn()) care must be taken with regards to boundaries which can be calculated, to a constant value z(00) which is assumed to be the zero point, using:\n\nbegingathered\nz_u0 = z_u-10+p_u-10\nz_0v = z_0v-1+q_0v-1\nendgathered\n\nIt is important to note as mentioned above if there are non-integrable points in the normal field then artefacts can appear in the reconstruction. These errors gradually average out but will lead to \"streaks\" appearing in the reconstruction. This is seen in the example below where the otherwise smooth sphere appears has ripple like structures pointing toward to top right corner. This can be corrected post reconstruction by smoothing but ideally a different integrator should be used. It is also interesting to note the parallels between this method and the Horn and Brooks method, with this method being effectively the forward component of Horn's method. As such this algorithm provided a useful middle ground between direct integration algorithms and iterative algorithms such as the Horn and Brooks method.\n\nParameters\n\nSplitPath integrator take no parameters.\n\nExample\n\nThe following example demonstrates the use of the SplitPath integrator.\n\nusing ShapeFromShading, Makie\n\n# Generate synthetic gradients\np, q = synthetic_gradient(SynthSphere(), radius = 38, img_size = 151)\n\n# Create a Path() integrator\nsplitPath = SplitPath()\n\n# Calculate the heightmap from the gradients\nZ = splitPath(p, q)\n\n# Normalize to maximum of 1 (not necessary but makes displaying easier)\nZ = Z./maximum(Z)\n\n# Display using Makie (Note: Makie can often take several minutes first time)\nr = 0.0:0.1:4\nsurface(r, r, Z)\n\nReference\n\n[1] D. Forsyth and J. Ponce, Computer vision: a modern approach. Upper Saddle River, N.J: Prentice Hall, 2003, pp. 84-86. [2] B. Horn and M. Brooks, \"The variational approach to shape from shading\", Computer Vision, Graphics, and Image Processing, vol. 33, no. 2, pp. 174-208, 1986. doi: 10.1016/0734-189x(86)90114-3\n\n\n\n\n\n","category":"method"},{"location":"#","page":"Home","title":"Home","text":"Horn(::AbstractArray, ::AbstractArray)","category":"page"},{"location":"#ShapeFromShading.Horn-Tuple{AbstractArray,AbstractArray}","page":"Home","title":"ShapeFromShading.Horn","text":"Horn()\n\nImplements the Horn and Brook's method of integrating surface normals. This algorithm offers an iterative solution to the Poisson equation describing the surface providing good reconstructions under most conditions.\n\nOutput\n\nHorn() returns a Horn integrator which can then be called to integrate a gradient field.\n\nDetails\n\nThe Horn and Brook's method attempts to solve the Poisson equation nabla^2z = partial_up + partial_vq by the discretization given below:\n\nz_u+1v+z_uv+1+z_u-1v+z_uv-1-4z_uv=fracp_u+1v-p_u-1v2+fracq_uv+1-q_uv-12\n\nWhich can be rearranged to give the iterative scheme provided by:\n\nz_uv^k+1= fracz_u+1v^k + z_uv+1^k + z_u-1v^k + z_uv-1^k4 - fracp_u+1v-p_u-1v8 - fracq_uv+1-q_uv-18\n\nThis scheme will always converge to a solution however the rate of convergence may depend upon the initial solution. This implementation will initilize with a zero solution. Neumann boundary conditions are imposed at the edges where the scheme would otherwise go out of bounds.\n\nParameters\n\nThe function parameters are described in more detail below.\n\nMax_iter:\n\nAn Int which controls the number of iterations the algorithm will run for.\n\nϵ:\n\nA Real representing the distance between pixels. This will Control how tall the final reconstruction is relative the array grid.\n\nExample\n\nThe following example demonstrates the use of the Horn integrator.\n\nusing ShapeFromShading, Makie\n\n# Generate synthetic gradients\np, q = synthetic_gradient(SynthSphere(), radius = 38, img_size = 151)\n\n# Create a Horn() integrator\nhorn = Horn(ϵ = 0.03, max_iter = 10000)\n\n# Calculate the heightmap from the gradients\nZ = horn(p, q)\n\n# Display using Makie (Note: Makie can often take several minutes first time)\nr = 0.0:0.1:4\nsurface(r, r, Z)\n\nReference\n\n[1] B. Horn and M. Brooks, \"The variational approach to shape from shading\", Computer Vision, Graphics, and Image Processing, vol. 33, no. 2, pp. 174-208, 1986. doi: 10.1016/0734-189x(86)90114-3\n\n\n\n\n\n","category":"method"},{"location":"#","page":"Home","title":"Home","text":"Durou(::AbstractArray, ::AbstractArray)","category":"page"},{"location":"#ShapeFromShading.Durou-Tuple{AbstractArray,AbstractArray}","page":"Home","title":"ShapeFromShading.Durou","text":"Durou()\n\nImplements the Durou and Courteille method of integrating surface normals. This algorithm offers an iterative solution to the Poisson equation describing the surface extending Horn and Brook's method by improving the boundary approximation and providing good reconstructions under most conditions.\n\nOutput\n\nDurou() returns a Durou integrator which can then be called to integrate a gradient field.\n\nDetails\n\nTheDurou and Courteille's method attempts to solve the Poisson equation nabla^2z = partial_up + partial_vq by the discretization given below:\n\nz_u+1v+z_uv+1-2z_uv=fracp_u+1v+p_uv2+fracq_uv+1+q_uv2\n\nWhich can be rearranged to give the iterative scheme provided by:\n\nz_uv^k+1= fracz_u+1v^k + z_uv+1^k2 - fracp_u+1v+p_uv4 - fracq_uv+1+q_uv4\n\nThis scheme will always converge to a solution however the rate of convergence may depend upon the initial solution. This implementation will initialize with a zero solution. Natural boundary conditions are imposed at the edges using the condition partial_uz-p+partial_v-q=0. Although faster then the Horn and Brook's method and better at handling boundaries, it can generate a worse solution under some conditions.\n\nParameters\n\nThe function parameters are described in more detail below.\n\nMax_iter:\n\nAn Int which controls the number of iterations the algorithm will run for. the range [0,1].\n\nϵ:\n\nA Real representing the distance between pixels. This will Control how tall the final reconstruction is relative the array grid.\n\nExample\n\nThe following example demonstrates the use of the Durou integrator.\n\nusing ShapeFromShading, Makie\n\n# Generate synthetic gradients\np, q = synthetic_gradient(SynthSphere(), radius = 38, img_size = 151)\n\n# Create a Durou() integrator\ndurou = Durou(ϵ = 0.03, max_iter = 10000)\n\n# Calculate the heightmap from the gradients\nZ = durou(p, q)\n\n# Display using Makie (Note: Makie can often take several minutes first time)\nr = 0.0:0.1:4\nsurface(r, r, Z)\n\nReference\n\n[1] Y. Quéau, J. Durou and J. Aujol, \"Normal Integration: A Survey\", Journal of Mathematical Imaging and Vision, vol. 60, no. 4, pp. 576-593, 2017. doi: 10.1007/s10851-017-0773-x\n\n\n\n\n\n","category":"method"},{"location":"#","page":"Home","title":"Home","text":"Quadratic(::AbstractArray, ::AbstractArray)","category":"page"},{"location":"#ShapeFromShading.Quadratic-Tuple{AbstractArray,AbstractArray}","page":"Home","title":"ShapeFromShading.Quadratic","text":"Quadratic()\n\nImplements the quadratic variational least squared method proposed by Aujol, Durou and Quéau. The algorithm solves the least squares system generated from minimizing a fidelity term mathcalF(z) = iint_(uv)in OmegaPhi(nabla z(uv) - g(uv))dudv and a regularization term mathcalR(z) = iint_(uv)in Omegalambda leftz(uv)-z^0(uv)right^2dudv where Phi(s) = s^2. This method is able to quickly produce good solutions on a smooth surface and can easily handle non-rectangular domains or sub-divided domains and can provide a good starting solution for other algorithms.\n\nOutput\n\nQuadratic() returns a Quadratic integrator which can then be called to run the quadratic method on a gradient field.\n\nDetails\n\nAs mentioned above the quadratic variational least squared method aims to minimize a fidelity term mathcalF(z) = iint_(uv)in OmegaPhi(nabla z(uv) - g(uv))dudv and a regulization term mathcalR(z) = iint_(uv)in Omegalambda leftz(uv)-z^0(uv)right^2dudv where Phi(s) = s^2.\n\nThis leads to the minimization problem given by:\n\nminiint_(uv)in Omeganabla z(uv)-mathbfg(uv)^2+lambda(uv)leftz(uv)-z^0(uv)right^2dudv\n\nBy discretizing the problem we can arrive at the functional:\n\nbeginaligned\nE(z) = frac12left(sum_(uv)in Omega_u^+partial_u^+z_uv-p_uv^2 + sum_(uv)in Omega_u^-partial_u^-z_uv-p_uv^2 + sum_(uv)in Omega_v^+partial_v^+z_uv-q_uv^2 + sum_(uv)in Omega_v^-partial_v^-z_uv-q_uv^2right) + sum_(uv)in Omegaz_uv-z^0_uv^2\nendaligned\n\nwhere Omega_u^+ represents the domain where (uv)in(uv)inOmega(uv)(u+1v)inOmega etc.. Using this definition the discrete differences can be converted into matrix form, where p_uv=z_u+1v-z_uv is the forward difference in the u direction etc. This data is then stacked into three vectors; mathbfzmathbfpmathbfqinR^Omega. Thus the matrix reresenting each of these is defined as below where m(i) is the mapping of the ith element of this vector to its corresponding point in (uv) and D_u^+ is a OmegatimesOmega matrix.\n\nD_u^+ij=begincases\n   0 textif  m(i)notinOmega_u^+ textor  j ne i textor  j ne i+1\n   -1 textif  j = i text and  m(i)inOmega_u^+\n   1 textif  j = i+1 text and  m(i)inOmega_u^+\nendcases\n\nFor a 2X2 domain this looks like:\n\nD_u^+ = beginbmatrix\n   -1  1  0  0 \n   0  0  0  0 \n   0  0  -1  1 \n   0  0  0  0\nendbmatrix\n\nThe other three discrete differences matrices are similarly defined from there definitions to be D_u^-, D_v^+ and D_v^-. These can then be used to redefine the minimization problem to be in the form:\n\nE(mathbfz)=frac12left(D_u^+mathbfz-mathbfp^2+D_u^-mathbfz-mathbfp^2+D_v^+mathbfz-mathbfq^2+D_v^-mathbfz-mathbfq^2right)+Lambda(mathbfz-mathbf(z)^0)^2\n\nWhere Lambda is the OmegatimesOmega diagonal matrix containing the values of sqrtlambda_uv. Using the above definitions the negative Laplacian matrix can then be defined as:\n\nL=frac12D_u^+^top D_u^++D_u^-^top D_u^-+D_v^+^top D_v^++D_v^-^top D_v^-\n\nFinally the least minimization problem can be represented in the form of a least squares problem of the form Amathbfz=mathbfb where:\n\nbegingathered\n    A=L+Lambda^2\n    mathbfb=frac12leftD_u^+^top+D_u^-^toprightmathbfp+frac12leftD_v^+^top+D_v^-^toprightmathbfq+Labda^2mathbfz^0\n    =D_umathbfp+D_vmathbfq+Labda^2mathbfz^0\nendgathered\n\nThis system is then solved using a standard conjugate gradient algorithm where the initialization has only a slight impact on the runtime and no impact on the final solution. The algorithm provides good results on smooth surfaces but struggles in the presence of discontinuities.\n\nParameters\n\nz:\n\nAn AbstractArray which defines the value of z^0 the initial solution and prior to be used in the regularization term. Must be provided.\n\nλ:\n\nAn AbstractArray the same size as z, defaulting to 100^-6 everywhere. This defines theregulization weight at each point. Large values will force the algorithm to keep the solution near to z^0 at that position. Can be used to keep the solution near the initial solution or guide the solution to a certain known value at points (i.e. known maxima and minima). This value should be set uniformly small otherwise.\n\nmask:\n\nAn AbstractArray the same size as z, which guides the algorithm as to where the valid domain is. Values of 1 will be in the domain Omega while other values will be ignored and set to z^0. This can be used to integrate over sub-domain or to segment the domain into parts. The gen_mask() funtion can be used to generate a mask which will remove non-integrable regions dramatically improving the solution under most condition at the cost of not integrating the entire solution.\n\nExample\n\nThe following example demonstrates the use of the Quadratic integrator.\n\nusing ShapeFromShading, Makie\n\n# Generate synthetic gradients\np, q = synthetic_gradient(Prism(), radius = 75, img_size = 151)\n\n# Create a Quadratic() integrator\nquadratic = Quadratic(z=zeros(size(p)))\nquadraticMasked = Quadratic(z=zeros(size(p)), mask=gen_mask(p,q,1.0)[:,:,1])\n\n# Calculate the heightmap from the gradients\nZ = quadratic(p, q)\nZ2 = quadraticMasked(p, q)\n\n# Normalize to maximum of 1 (not necessary but makes displaying easier)\nZ = Z./maximum(Z)\nZ2 = Z2./maximum(Z2)\n\n# Display using Makie (Note: Makie can often take several minutes first time)\nr = 0.0:0.1:4\nvbox(surface(r, r, Z), surface(r, r, Z2))\n\nReference\n\n[1] Y. Quéau, J. Durou and J. Aujol, \"Variational Methods for Normal Integration\", Journal of Mathematical Imaging and Vision, vol. 60, no. 4, pp. 609-632, 2017. doi: 10.1007/s10851-017-0777-6\n\n\n\n\n\n","category":"method"},{"location":"#","page":"Home","title":"Home","text":"TotalVariation(::AbstractArray, ::AbstractArray)","category":"page"},{"location":"#ShapeFromShading.TotalVariation-Tuple{AbstractArray,AbstractArray}","page":"Home","title":"ShapeFromShading.TotalVariation","text":"TotalVariation()\n\nImplements the total variational method proposed by Aujol, Durou and Quéau. The algorithm solves the same minimization problem as th Quadraticmethod exept the fidelity terms function Phi(s)=s_L_1. This method is able to produce good solutions on a smooth and piecewise smooth surface and can easily handle non-rectangular domains or sub-divided domains.\n\nOutput\n\nTotalVariation() returns a TotalVariation integrator which can then be called to run the quadratic method on a gradient field.\n\nDetails\n\nAs discussed above this algorithm used the same fidelity and regularization terms as the Quadratic method exept the Phi(s)=s^2 term is replaced with Phi(s)=s_L_1. This leads to the minimization problem defined by:\n\nminiint_(uv)in Omeganabla z(uv)-mathbfg(uv)+lambda(uv)leftz(uv)-z^0(uv)right^2dudv\n\nBy considering the four posible discreatisations of z(uv) we can generate four posible domains to consider given by; Omega^UV=Omega_u^UcupOmega_v^V (UV)in+-^2 where +-^2 refers to all posible combinations of +,-. Using these the following discreate functional can be generated:\n\nbeginaligned\nE(mathbfz)=frac14Big(sum_(uv)inOmega^++sqrtpartial_u^+z_uv-p_uv^2+partial_v^+z_uv-q_uv^2\n+sum_(uv)inOmega^+-sqrtpartial_u^+z_uv-p_uv^2+partial_v^-z_uv-q_uv^2\n+sum_(uv)inOmega^-+sqrtpartial_u^-z_uv-p_uv^2+partial_v^+z_uv-q_uv^2\n+sum_(uv)inOmega^--sqrtpartial_u^-z_uv-p_uv^2+partial_v^-z_uv-q_uv^2Big)\n+sum_(uv)inOmegalambda_uvleftz_uv-z^0_uvright^2\nendaligned\n\nWhich simplifies to the minimization problem:\n\nbegingathered\nminfrac14sum_(UV)in+-^2sum(uv)inOmega^UVmathbfr_(uv)^UV+sum_(uv)inOmegalambda_uvleftz_uv-z^0_uvright^2\nmathbfr_(uv)^UV=nabla^UVz_uv-mathbfg_uv\nendgathered\n\nThis leads to the optimization scheme using an ADMM algorithm defined by:\n\nbeginaligned\nz^(k+1)=argminfracalpha8sum_(UV)in+-^2sum_(uv)inOmega^UVnabla^UVz_uv-(mathbfg_uv+mathbfr_(uv)^UV^(k)-mathbfb_(uv)^UV^(k))+sum_(uv)inOmegalambda_uvleftz_uv-z^0_uvright^2\nmathbfr_(uv)^UV^(k+1)=argminfracalpha8mathbfr-(nabla^UVz_uv-mathbfg_uv+mathbfb_(uv)^UV^(k))+mathbfr\nmathbfb_(uv)^UV^(k+1)=mathbfb_(uv)^UV^(k))+nabla^UVz_uv-mathbfg_uv-mathbfr_(uv)^UV^(k+1)\nbeginaligned\n\nThe z update then can be solved using the linear system defined below, where D_{u,v}^{U,V} and Lambda are the same at those defined in Quadratic.\n\nbeginaligned\n    A_TVmathbfz^(k+1)=b_TV^(k)\n    A_TV=fracalpha8sum_(UV)in+-^2leftD_u^UtopD_u^U+D_v^VtopD_v^Vright + Lambda^2\n    b_TV^(k)=fracalpha8sum_(UV)in+-^2leftD_u^UtopmathbfP^UV^(k) + D_v^VtopmathbfQ^UV^(k)right+ Lambda^2mathbfz^0\nendaligned\n\nWhere mathbfP^UV^(k) mathbfQ^UV^(k) are the u and v components of mathbfg+mathbfr^UV^(k)-mathbfb^UV^(k). This can be solved using conjugate gradient. Finally the update to mathbfr^UV can be computed as:\n\nbeginaligned\n    mathbfr^UV^(k+1)=maxBigmathbfs_uv^UV^(k+1)-frac4alpha0Bigfracmathbfs_uv^UV^(k+1)mathbfs_uv^UV^(k+1)\n    textWhere\n    mathbfs^UV^(k+1)=nabla^UVz_uv^(k+1)-mathbfg_uv+mathbfb_uv^UV^(k)\nendaligned\n\nParameters\n\nz:\n\nAn AbstractArray which defines the value of z^0 the initial solution and prior to be used in the regulization term. Must be provided.\n\nα:\n\nA Real with defult value of 1.0 which controls the step size. In theory this value should have no impact on final solution but in practice larger values can lead to worse solutions while values which are two small may lead non-convergance in the least square update step, causing the algorithm to hang for long periods of time. Values below 0.25 are not recomended but may work depending on domain size and inputs.\n\nλ:\n\nAn AbstractArray the same size as z defulting to 100^-6 everywhere. This defines theregulization weight at each point. Large valueas will force the algorithm to keep the solution near to z^0 at that position. Can be used to keep the solution near the initial solution or guide the solution to a certian known value at points (i.e. known maxima and minima). This value should be set uniformly small otherwise.\n\nmask:\n\nAn AbstractArray the same size as z, which guides the algorithm as to where the valid domain is. Values of 1 will be in the domain Omega while other values will be ignored and set to z^0. This can be used to integrate over sub-domain or to segment the domain into parts. The gen_mask() funtion can be used to generate a mask which will remove non-integrable regions dramatically improving the solution under most condition at the cost of not integrating the entire solution.\n\nExample\n\nThe following example demonstrates the use of the TotalVariation integrator.\n\nusing ShapeFromShading, Makie\n\n# Generate synthetic gradients\np, q = synthetic_gradient(Prism(), radius = 75, img_size = 151)\n\n# Create a TotalVariation() integrator\ntotalVariation = TotalVariation(z=zeros(size(p)), α=1.0)\ntotalVariationMasked = TotalVariation(z=zeros(size(p)), α=0.5, mask=gen_mask(p,q,1.0)[:,:,1])\n\n# Calculate the heightmap from the gradients\nZ = totalVariation(p, q)\nZ2 = totalVariationMasked(p, q)\n\n# Normalize to maximum of 1 (not necessary but makes displaying easier)\nZ = Z./maximum(Z)\nZ2 = Z2./maximum(Z2)\n\n# Display using Makie (Note: Makie can often take several minutes first time)\nr = 0.0:0.1:4\nvbox(surface(r, r, Z), surface(r, r, Z2))\n\nReference\n\n[1] Y. Quéau, J. Durou and J. Aujol, \"Variational Methods for Normal Integration\", Journal of Mathematical Imaging and Vision, vol. 60, no. 4, pp. 609-632, 2017. doi: 10.1007/s10851-017-0777-6\n\n\n\n\n\n","category":"method"},{"location":"#Shape-From-Shading:-1","page":"Home","title":"Shape From Shading:","text":"","category":"section"},{"location":"#Benchmarking:-1","page":"Home","title":"Benchmarking:","text":"","category":"section"},{"location":"#Miscellaneous:-1","page":"Home","title":"Miscellaneous:","text":"","category":"section"}]
}
