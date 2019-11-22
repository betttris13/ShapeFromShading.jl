@doc raw"""
```
Pentland(slant::Real = Inf, tilt::Real = Inf)
```
Creates a `Pentland` fucntor which attempts to produce a heightmap from a grayscale
image using Pentland's algorithm. Under the assumptions of Lambertian surface,
orthographic projections, the surface being illuminated by distant light sources,
the surface is not self-shadowing and the surface has constant albedo, hence it
can be ignored. The algorithm employs Tayler series expansion and Fourier transforms
to compute a non-iterative solution.
# Output
Returns a `Pentland` functor which can be used to run the Pentland algorithm to
reconstruct a surface form a grayscale image.
# Details
In Pentlands algorithm the image irradiance is defined as:
```math
E(x,y)=R(p,q)=\dfrac{\rho(i_xp+i_yq-i_z)}{\sqrt{1+p^2+q^2}}=\dfrac{p\sin\sigma\cos
\tau+q\sin\sigma\sin\tau+\cos\sigma}{\sqrt{1+p^2+q^2}}
```
This can be reduced using the Taylor series expansion about ``p=p_0`` and ``p=p_0``
and ignoring the higher order terms becomes:
```math
E(x,y)=R(p,q)\approx R(p_0,q_0)+(p-p_0)\dfrac{\delta R}{\delta p}(p_0,q_0)+(q-q_0)
\dfrac{\delta R}{\delta q}(p_0,q_0)
```
which for ``p_0=q_0=0`` further reduces to:
```math
E(x,y)\approx\cos\sigma+p\cos\tau\sin\sigma+q\sin\tau\sin\sigma
```
This gives the following transform identities:
```math
\begin{gathered}
p=\dfrac{\delta}{\delta x}Z(x,y)\xleftrightarrow{\Im}(-j\omega_x)F_z(
\omega_x,\omega_y)\\q=\dfrac{\delta}{\delta y}Z(x,y)\xleftrightarrow{\Im}(-j
\omega_y)F_z(\omega_x,\omega_y)
\end{gathered}
```
By taking the Fourier transform of both sides if ``E(x,y)`` yields the following:
```math
F_E=(-j\omega_x)F_z(\omega_x,\omega_y)\cos\tau\sin\sigma+(-j\omega_y)F_z(\omega_x
,\omega_y)\sin\tau\sin\sigma
```
where ``F_z`` is the Fourier transform of ``Z(x,y)``.

These can be rearranged, and the Inverse Fourier transform used to recover the
surface ``Z(x,y)`` as per the following:
```math
\begin{gathered}
F_E=F_z(\omega_x,\omega_y)[-j\omega_x\cos\tau\sin\sigma-j\omega_y\sin\tau\sin
\sigma]\\\Rightarrow F_z(\omega_x,\omega_y)=\dfrac{F_E}{-j\omega_x\cos\tau\sin
\sigma-j\omega_y\sin\tau\sin\sigma}\\Z(x,y)=\Im^{-1}\{F_z(\omega_x,\omega_y)\}
\end{gathered}
```
# Arguments
The function arguments are described in more detail below.
## `slant`
A `Real` that specifies the slant value to be used by the algorithm. The `slant`
should be a value in the range [0,π/2]. If `slant` is specified to must the `tilt`.
Will defult to `Inf` which will trigger `estimate_img_properties` to be run.
## `tilt`
A `Real` that specifies the tilt value to be used by the algorithm. The `tilt`
should be a value in the range [0,2π]. If `tilt` is specified to must
the `slant`. Will defult to `Inf` which will trigger `estimate_img_properties` to
be run.
!!! note
    If `slant` and `tilt` are not defined (i.e. have defulted to `Inf`) they
    will be calculated at runtime using `estimate_img_properties`.
# Example
Compute the heightmap for a synthetic image generated by `generate_surface`.
```julia
using Images, Makie, ShapeFromShading

#generate synthetic image
img = generate_surface(SynthSphere(50), 1.0, [0.1,0,0.9])

#calculate the heightmap
pentland = Pentland(slant = 0.1106572211739, tilt = 0.0)
Z = pentland(img)

#normalize to maximum of 1 (not necessary but makes displaying easier)
Z = Z./maximum(Z)

#display using Makie (Note: Makie can often take several minutes first time)
r = 0.0:0.1:2
surface(r, r, Z)
```
# Reference
1. A. Pentland, "Shape Information From Shading: A Theory About Human Perception," [1988 Proceedings] Second International Conference on Computer Vision, Tampa, FL, USA, 1988, pp. 404-413. [doi: 10.1109/CCV.1988.590017](https://doi.org/10.1109/ccv.1988.590017 )
"""
function (algorithm::Pentland)(img::AbstractArray)
    #find illumination and albedo
    σ = algorithm.slant
    τ = algorithm.tilt
    if σ == Inf || τ == Inf
        ρ, I, σ, τ = estimate_img_properties(img)
    end

    E = Complex{Float64}.(reinterpret(Float64, img))

    #take Fourier transform
    fft!(E)
    M, N = size(E)

    #setup wx and wy
    wx, wy = setup_transform_values_pentland(M, N)

    #using the illumination direction calculate the transformed Z
    Zₜ = zeros(Complex{Float64}, size(E))
    for i in CartesianIndices(Zₜ)
        Zₜ[i] = E[i] / (-1im * wx[i] * cos(τ) * sin(σ) - 1im * wy[i] * sin(τ)
            * sin(σ))
    end

    #recover Z
    ifft!(Zₜ)
    Z = zeros(Float64, size(E))
    for i in CartesianIndices(Z)
        Z[i] = abs(Zₜ[i])
    end
    return Z
end