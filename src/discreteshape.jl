@doc raw"""
```
DiscreteShape(iterations::Int = 2000, smoothness::Int = 1000, albedo::Real = Inf, illumination_direction::Vector{T} where T <: Real = [Inf, Inf, Inf])
```
Contins `DiscreteShape` algorithm which ttempts to produce a heightmap from a
grayscale image by minimization of a set of Euler-Lagrange equations. This is done
discretely at each point in the image utilizing the second derivates of the
surface normals and their Fourier Transforms.
# Output
Returns a `DiscreteShape` functor which can be run on an image to attempt reconstruction
of the surface contianed in the image.
# Details
The algorithm attempts to minimise the brightness deviation ``ϵ`` through the
brightness constraint ``\epsilon_1`` and smoothness constraint ``\epsilon_2``
as defined bellow:
```math
\epsilon=\iint((\epsilon_1+\lambda\epsilon_2))dxdy=\iint((E(x,y)-R(p,q))^2+
\lambda(p_x^2+q_x^2+p_y^2+q_y^2))
```
This is minimised using the Euler-Lagrange equations defined as;
```math
\dfrac{\delta\epsilon}{\delta p}-\dfrac{\delta}{\delta x}\dfrac{\delta\epsilon}{
\delta p_x}-\dfrac{\delta}{\delta y}\dfrac{\delta\epsilon}{\delta p_y}=0
```
and
```math
\dfrac{\delta
\epsilon}{\delta q}-\dfrac{\delta}{\delta x}\dfrac{\delta\epsilon}{\delta q_x}-
\dfrac{\delta}{\delta y}\dfrac{\delta\epsilon}{\delta q_y}=0
```
which become:
```math
\begin{gathered}
-2(E-R)\dfrac{\delta R}{\delta p}-2\lambda p_{xx}-2\lambda p_{yy}=0\\
-2(E-R)\dfrac{\delta R}{\delta p}-2\lambda q_{xx}-2\lambda q_{yy}=0
\end{gathered}
```
which can be further simplified to give:
```math
\begin{gathered}
\nabla^2p=\dfrac{1}{\lambda}(R-E)\dfrac{\delta R}{\delta p}\\
\nabla^2q=\dfrac{1}{\lambda}(R-E)\dfrac{\delta R}{\delta q}
\end{gathered}
```
where ``\nabla^2p=p_{xx}+p_{yy}`` and ``\nabla^2q=q_{xx}+q_{yy}`` are Laplacians
of p and q.

However, for computation we are dealing with a discreate case of these equations
which can be defined as below:
```math
\begin{gathered}
p_{i,j}=\bar{p}_{i,j}+\dfrac{1}{4\lambda}(E-R)\dfrac{\delta R}{\delta p}\\q_{i,j}=
\bar{q}_{i,j}+\dfrac{1}{4\lambda}(E-R)\dfrac{\delta R}{\delta q}\\
\end{gathered}
```
where
```math
\bar{p}_{i,j}=\dfrac{p_{i+1,j}+p_{i-1,j}+p_{i,j+1}+p_{i,j-1}}{4}
```
and
```math
\bar{q}_{i,j}=\dfrac{q_{i+1,j}+q_{i-1,j}+q_{i,j+1}+q_{i,j-1}}{4}
```
Finally, the algorithm needs to enforce integrability on p and q and retrieve
the surface Z. This can be done by taking the Fast Fourier Transform of p and q
()``c_p(\omega_x,\omega_y)`` and ``c_q(\omega_x,\omega_y)``) and then using the
Inverse Fast Fourier Transform to recover Z and update p and q as per bellow:
```math
\begin{gathered}
p=\sum c_p(\omega_x,\omega_y)e^{j(\omega_xx+\omega_yy)}\\
q=\sum c_q(\omega_x,\omega_y)e^{j(\omega_xx+\omega_yy)}\\Z=\sum c(\omega_x,\omega_y)
e^{j(\omega_xx+\omega_yy)}\\
\end{gathered}
```
where
```math
c(\omega_x,\omega_y)=\dfrac{-j(\omega_xc_p(\omega_x,\omega_y)+\omega_yc_q(\omega_x
,\omega_y))}{\omega_x^2+\omega_y^2}
```
# Arguments
The arguments are described in more detail below.
## `albedo`
A `Real` that specifies the albedo (amount of light reflected) of the image. If
`albedo` is specified to must the `illumination_direction`. Defults to `Inf` which
will trigger the algorithm to run `estimate_img_properties`.
## `illumination_direction`
A `Vector{T} where T <: Real` that specifies the tilt value to be used by the
algorithm. The `illumination_direction` should be a vector of the form [x,y,z]
where x,y,z are int he range [0,1]. If `illumination_direction` is specified
to must the `albedo`. Defults to `[Inf, Inf, Inf]` which
will trigger the algorithm to run `estimate_img_properties`.
## `iterations`
An `Int` that specifies the number of iterations the algorithm is to perform. If
left unspecified a default value of 2000 is used.
## `smoothness`
An `Int` that specifies the strength of the smoothness constraint in the minimised
function. Defults to `1000`.
!!! note
    If `albedo` and `illumination_direction` are not defined (i.e. have defulted
    to `Inf`) they will be calculated at runtime using `estimate_img_properties`.
# Example
Compute the heightmap for a synthetic image generated by `generate_surface`.
```julia
using Images, Makie, ShapeFromShading

#generate synthetic image
img = generate_surface(SynthSphere(50), 1.0, [0.2,0,0.9])

#calculate the heightmap (using 500 iterations)
discreteShape = DiscreteShape(iterations = 500, albedo = 1.0, illumination_direction = [0.2,0,0.9])
Z,p,q = discreteShape(img)

#normalize to maximum of 1 (not necessary but makes displaying easier)
Z = Z./maximum(Z)

#display using Makie (Note: Makie can often take several minutes first time)
r = 0.0:0.1:2
surface(r, r, Z)
```
# Reference
1. S. Elhabian, "Hands on Shape from Shading", Computer Vision and Image Processing, 2008.
"""
function (algorithm::DiscreteShape)(img::AbstractArray)
    ρ = algorithm.albedo
    I = algorithm.illumination_direction
    smoothness = algorithm.smoothness
    iterations = algorithm.iterations

    if ρ == Inf || I == [Inf, Inf, Inf]
        ρ,I,σ,τ = estimate_img_properties(img)
    end

    E = Array{Float64}(img)

    #initialize variables
    p = zeros(Complex{Float64},axes(E))
    q = zeros(Complex{Float64},axes(E))
    R = zeros(Complex{Float64},axes(E))
    Z = zeros(axes(E))
    return solve_EulerLagrange(ρ, I, iterations, p, q, R, smoothness, E, Z)
end
